import { startOfWeek } from 'date-fns'

import { Delta } from '@core/interfaces/delta.interface'
import { Status } from '@core/interfaces/status.interface'

import { Command } from './base.command'

export abstract class BaseDeltaCommand extends Command<Delta> {
  static buildDefaultDelta(): Delta {
    return {
      progress: 0,
    }
  }

  protected getComparisonDate(baseDate?: Date): Date {
    baseDate ??= new Date()

    return startOfWeek(baseDate)
  }

  protected getProgressDifference(currentStatus: Status, previousStatus: Status): number {
    return currentStatus.progress - previousStatus.progress
  }
}
