import { sum, minBy, maxBy } from 'lodash'

import { GetStatusOptions, Status } from '@core/interfaces/status.interface'

import { Command } from './base.command'

export abstract class BaseStatusCommand extends Command<Status> {
  protected defaultOptions: GetStatusOptions = {}

  static buildDefaultStatus(): Status {
    return {
      progress: 0,
      confidence: 0,
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
}
