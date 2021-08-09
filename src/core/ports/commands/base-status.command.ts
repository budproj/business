import { differenceInCalendarWeeks } from 'date-fns'
import { sum, maxBy, min, groupBy, filter, zip } from 'lodash'

import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { EntityOrderAttributes, Order, OrderAttribute } from '@core/types/order-attribute.type'

import { Command } from './base.command'

export abstract class BaseStatusCommand extends Command<Status> {
  protected readonly defaultOptions: GetStatusOptions = {}
  protected readonly defaultStatus: Status = {
    progress: 0,
    confidence: 100,
    isOutdated: true,
    isActive: true,
  }

  protected getAverage(
    numberList: number[],
    defaultValue: number = this.defaultStatus.progress,
  ): number {
    const onlyDefinedNumbers = filter(numberList)
    if (onlyDefinedNumbers.length === 0) return defaultValue

    return sum(numberList) / numberList.length
  }

  protected getLatestCheckInFromList(
    checkInList: KeyResultCheckInInterface[],
  ): KeyResultCheckInInterface | undefined {
    return maxBy(checkInList, 'createdAt')
  }

  protected isOutdated(
    latestKeyResultCheckIn?: KeyResultCheckInInterface,
    baseDate?: Date,
  ): boolean {
    baseDate ??= new Date()
    const checkInDate = latestKeyResultCheckIn?.createdAt ?? baseDate

    return differenceInCalendarWeeks(baseDate, checkInDate) > 0
  }

  protected async getKeyResultProgressesFromKeyResultList(
    keyResults: KeyResult[],
  ): Promise<number[]> {
    const progressPromises = keyResults.map(async (keyResult) =>
      this.core.keyResult.getCheckInProgress(keyResult.checkIns[0], keyResult),
    )

    return Promise.all(progressPromises)
  }

  protected async unzipKeyResultGroup(
    keyResults: KeyResult[],
  ): Promise<[KeyResultCheckInInterface[], number[], number[]]> {
    const objectiveKeyResults = groupBy(keyResults, 'objectiveId')
    const keyResultsByObjective = Object.values(objectiveKeyResults)

    const latestCheckIns = keyResults.map((keyResult) => keyResult.checkIns[0])

    const groupedKeyResultsProgressPromise = keyResultsByObjective.map(async (keyResultList) =>
      this.getKeyResultProgressesFromKeyResultList(keyResultList),
    )
    const groupedKeyResultsProgress = await Promise.all(groupedKeyResultsProgressPromise)

    const progresses = groupedKeyResultsProgress.map((progressList) =>
      this.getAverage(progressList),
    )
    const confidences = latestCheckIns.map((checkIn) => checkIn?.confidence)

    return [latestCheckIns, progresses, confidences]
  }

  protected getMin(
    numberList: number[],
    defaultValue: number = this.defaultStatus.confidence,
  ): number {
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

  private zipOrderAttributes(attributes: string[], orders: Order[]): OrderAttribute[] {
    const zippedValues = zip(attributes, orders)

    return zippedValues.map((values) => this.buildOrderAttribute(...values))
  }

  private buildOrderAttribute(attribute: string, order: Order): OrderAttribute {
    return [attribute, order]
  }
}
