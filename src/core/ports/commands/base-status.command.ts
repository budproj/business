import { differenceInCalendarWeeks } from 'date-fns'
import { sum, minBy, maxBy, min } from 'lodash'

import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

export abstract class BaseStatusCommand extends Command<Status> {
  protected readonly defaultOptions: GetStatusOptions = {}
  protected readonly defaultStatus: Status = {
    progress: 0,
    confidence: 100,
    isOutdated: true,
    isActive: true,
  }

  protected async marshal(
    latestCheckIn?: KeyResultCheckIn,
    isOutdated = this.defaultStatus.isOutdated,
    isActive = this.defaultStatus.isActive,
  ): Promise<Status> {
    const progress = await this.core.keyResult.getCheckInProgress(latestCheckIn)
    const confidence = latestCheckIn?.confidence ?? this.defaultStatus.confidence

    return {
      latestCheckIn,
      isActive,
      isOutdated,
      progress,
      confidence,
    }
  }

  protected getAverageProgressFromGroups(groupList: Status[][]): number {
    if (groupList.length === 0) return 0
    const groupListAverages = groupList.map((statusList) =>
      this.getAverageProgressFromList(statusList),
    )

    return this.getAverage(groupListAverages)
  }

  protected getAverageProgressFromList(statusList: Status[]): number {
    if (statusList.length === 0) return 0
    const progressList = statusList.map((status) => status.progress)

    return this.getAverage(progressList)
  }

  protected getAverage(
    numberList: number[],
    defaultValue: number = this.defaultStatus.progress,
  ): number {
    if (numberList.length === 0) return defaultValue

    return sum(numberList) / numberList.length
  }

  protected getMinConfidenceFromList(statusList: Status[]): number {
    if (statusList.length === 0) return this.defaultStatus.confidence
    const smallestConfidenceStatus = minBy(statusList, 'confidence')

    return smallestConfidenceStatus.confidence
  }

  protected getLatestCheckInFromList(
    checkInList: KeyResultCheckInInterface[],
  ): KeyResultCheckInInterface {
    return maxBy(checkInList, 'createdAt')
  }

  protected getLatestFromList(statusList: Status[]): Status {
    if (statusList.length === 0) return this.defaultStatus

    return maxBy(statusList, 'reportDate') ?? statusList[0]
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
    const latestCheckIns = keyResults.map((keyResult) => keyResult.checkIns[0])
    const progresses = await this.getKeyResultProgressesFromKeyResultList(keyResults)
    const confidences = latestCheckIns.map((checkIn) => checkIn?.confidence)

    return [latestCheckIns, progresses, confidences]
  }

  protected getMin(
    numberList: number[],
    defaultValue: number = this.defaultStatus.confidence,
  ): number {
    if (numberList.length === 0) return defaultValue

    return min(numberList)
  }
}
