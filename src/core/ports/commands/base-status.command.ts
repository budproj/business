import { differenceInDays } from 'date-fns'
import { sum, maxBy, min, groupBy, filter, zip, flatten } from 'lodash'

import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { EntityOrderAttributes, Order, OrderAttribute } from '@core/types/order-attribute.type'
import { Stopwatch } from '@lib/logger/pino.decorator'

import { Command } from './base.command'

export abstract class BaseStatusCommand extends Command<Status> {
  protected readonly defaultOptions: GetStatusOptions = {}
  protected readonly defaultStatus: Status = {
    progress: 0,
    confidence: 100,
    isOutdated: true,
    isActive: true,
  }

  protected getAverage(numberList: number[], defaultValue: number = this.defaultStatus.progress): number {
    const onlyDefinedNumbers = filter(numberList)
    if (onlyDefinedNumbers.length === 0) return defaultValue

    return sum(numberList) / numberList.length
  }

  protected getLatestCheckInFromList(checkInList: KeyResultCheckInInterface[]): KeyResultCheckInInterface | undefined {
    return maxBy(checkInList, 'createdAt')
  }

  protected isOutdated(
    latestKeyResultCheckIn?: KeyResultCheckInInterface,
    baseDate?: Date,
    fallbackDate?: Date,
  ): boolean {
    fallbackDate ??= new Date()
    const checkInDate = latestKeyResultCheckIn?.createdAt ?? fallbackDate

    return differenceInDays(baseDate, checkInDate) > 6
  }

  protected async getKeyResultProgressesFromKeyResultList(
    keyResults: KeyResult[],
    latestCheckIns: KeyResultCheckInInterface[],
  ): Promise<number[]> {
    return this.core.keyResult.getCheckInProgressBatch(keyResults, latestCheckIns)
  }

  @Stopwatch()
  protected async unzipKeyResultGroup(
    keyResults: KeyResult[],
    isUnzipingObjective = true,
  ): Promise<[KeyResultCheckInInterface[], number[], number[]]> {
    const objectiveKeyResults = groupBy(keyResults, isUnzipingObjective ? 'objectiveId' : 'id')
    const keyResultsByObjective = Object.values(objectiveKeyResults)

    const latestCheckIns = keyResults.map((keyResult) => keyResult.checkIns[0])

    const groupedKeyResultsProgressPromise = keyResultsByObjective.map(async (keyResultList) =>
      this.getKeyResultProgressesFromKeyResultList(keyResultList, latestCheckIns),
    )
    const groupedKeyResultsProgress = await Promise.all(groupedKeyResultsProgressPromise)

    const progresses = groupedKeyResultsProgress.map((progressList) => this.getAverage(progressList))
    const confidencesWithoutDeprioritized = latestCheckIns.filter((checkIn) => checkIn?.confidence !== -100)

    const confidences = confidencesWithoutDeprioritized.map((checkIn) => checkIn?.confidence)

    return [latestCheckIns, progresses, confidences]
  }

  protected getMin(numberList: number[], defaultValue: number = this.defaultStatus.confidence): number {
    const onlyDefinedNumbers = filter(numberList)
    if (onlyDefinedNumbers.length === 0) return defaultValue

    return min(onlyDefinedNumbers)
  }

  protected zipEntityOrderAttributes(
    entities: string[],
    attributes: string[][],
    orders: Order[][],
  ): EntityOrderAttributes[] {
    const zippedOrders = zip(attributes, orders)
    const orderAttributes = zippedOrders.map((values) => this.zipOrderAttributes(...values))

    return zip(entities, orderAttributes)
  }

  /**
   * @deprecated TODO: implement date filter at query level
   */
  protected removeKeyResultCheckInsBeforeDate(rawKeyResults: KeyResult[], date?: Date): KeyResult[] {
    return rawKeyResults.map((keyResult) => ({
      ...keyResult,
      checkIns: keyResult.checkIns.filter((checkIn) => (date ? checkIn.createdAt < date : checkIn)),
    }))
  }

  protected async getStatus(
    id: Objective['id'] | User['id'],
    options: GetStatusOptions = this.defaultOptions,
    isObjective = true,
  ): Promise<Status> {
    if (isObjective) {
      const keyResults = await this.getKeyResultsFromObjective(id, options)
      const [allObjectiveLatestCheckIns, progresses, confidences] = await this.unzipKeyResultGroup(keyResults)
      const latestCheckIn = this.getLatestCheckInFromList(allObjectiveLatestCheckIns)
      const isOutdated = this.isOutdated(latestCheckIn)
      const isActive = await this.core.objective.isActive(id)

      return {
        isOutdated,
        isActive,
        latestCheckIn,
        reportDate: latestCheckIn?.createdAt,
        progress: this.getAverage(progresses),
        confidence: this.getMin(confidences),
        total: keyResults.length,
      }
    }

    const keyResults = await this.getActiveKeyResultsFromUser(id, options)
    const filteredKeyResults = keyResults.filter((keyResult) => keyResult.teamId !== null)
    const [allUserLatestCheckIns, progresses, confidences] = await this.unzipKeyResultGroup(filteredKeyResults, false)

    const latestCheckIn = this.getLatestCheckInFromList(allUserLatestCheckIns)
    const isOutdated = this.isOutdated(latestCheckIn)

    const upToDateCheckIns = allUserLatestCheckIns.filter((checkIn) => {
      if (!checkIn) return false
      return !this.isOutdated(checkIn, new Date())
    })

    const checkmarks = await this.core.keyResult.keyResultCheckMarkProvider.getFromAssignedUser(id, true)

    return {
      isOutdated,
      latestCheckIn,
      allUpToDateCheckIns: upToDateCheckIns,
      checkmarks: flatten(checkmarks),
      reportDate: latestCheckIn?.createdAt,
      progress: this.getAverage(progresses),
      confidence: this.getMin(confidences),
      total: filteredKeyResults.length,
    }
  }

  private async getKeyResultsFromObjective(objectiveID: string, options: GetStatusOptions): Promise<KeyResult[]> {
    const filters = {
      keyResult: {
        createdAt: options.date,
      },
      objective: {
        id: objectiveID,
      },
    }
    const orderAttributes = this.zipEntityOrderAttributes(['keyResultCheckIn'], [['createdAt']], [['DESC']])

    const keyResults = await this.core.keyResult.getWithRelationFilters(filters, orderAttributes)

    return this.removeKeyResultCheckInsBeforeDate(keyResults, options.date)
  }

  private async getActiveKeyResultsFromUser(userId: string, options: GetStatusOptions): Promise<KeyResult[]> {
    const filters = {
      keyResult: {
        createdAt: options.date,
        ownerId: userId,
      },
    }

    const orderAttributes = this.zipEntityOrderAttributes(['keyResultCheckIn'], [['createdAt']], [['DESC']])

    const keyResults = await this.core.keyResult.getWithRelationFilters(filters, orderAttributes)

    const filteredKeyResults = keyResults.filter((keyResult) => keyResult.teamId !== null)

    const activeKeyResults = await this.core.keyResult.filterActiveKeyResultsFromList(filteredKeyResults)

    return this.removeKeyResultCheckInsBeforeDate(activeKeyResults, options.date)
  }

  private zipOrderAttributes(attributes: string[], orders: Order[]): OrderAttribute[] {
    const zippedValues = zip(attributes, orders)

    return zippedValues.map((values) => this.buildOrderAttribute(...values))
  }

  private buildOrderAttribute(attribute: string, order: Order): OrderAttribute {
    return [attribute, order]
  }
}
