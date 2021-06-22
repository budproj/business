import { differenceInCalendarWeeks } from 'date-fns'
import { sum, minBy, maxBy } from 'lodash'

import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

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

  protected getAverageProgressFromList(statusList: Status[]): number {
    if (statusList.length === 0) return 0
    const progressList = statusList.map((status) => status.progress)

    return sum(progressList) / statusList.length
  }

  protected getMinConfidenceFromList(statusList: Status[]): number {
    if (statusList.length === 0) return 100
    const smallestConfidenceStatus = minBy(statusList, 'confidence')

    return smallestConfidenceStatus.confidence
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
}
