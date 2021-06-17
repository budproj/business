import { differenceInCalendarWeeks } from 'date-fns'
import { sum, minBy, maxBy } from 'lodash'

import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'

import { Command } from './base.command'

export abstract class BaseStatusCommand extends Command<Status> {
  protected defaultOptions: GetStatusOptions = {}

  static buildDefaultStatus(): Status {
    return {
      progress: 0,
      confidence: 0,
      isOutdated: true,
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
    if (statusList.length === 0) return BaseStatusCommand.buildDefaultStatus()

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
