import { differenceInMinutes } from 'date-fns'

import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { Command } from './base.command'

type WindowUnit = 'minutes'
type WindowHandler = (dateLeft: Date, dateRight: Date) => number

export class GetCheckInWindowForCheckInCommand extends Command<number> {
  private readonly differenceHandlers: Record<WindowUnit, WindowHandler> = {
    minutes: differenceInMinutes,
  }

  public async execute(
    checkIn: Partial<KeyResultCheckIn>,
    timeUnit: WindowUnit = 'minutes',
  ): Promise<number> {
    const previousCheckIn = await this.core.keyResult.getFromKeyResultCheckInID(checkIn.parentId)
    if (!previousCheckIn) return 0

    const differenceHandler = this.differenceHandlers[timeUnit]
    const difference = differenceHandler(checkIn.createdAt, previousCheckIn.createdAt)

    return difference
  }
}
