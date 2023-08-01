import { differenceInMinutes } from 'date-fns'

import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { Command } from './base.command'

type WindowUnit = 'minutes'
type WindowHandler = (dateLeft: Date, dateRight: Date) => number

export class GetKeyResultCheckInWindowForCheckInCommand extends Command<number> {
  private readonly differenceHandlers: Record<WindowUnit, WindowHandler> = {
    minutes: differenceInMinutes,
  }

  public async execute(checkIn: Partial<KeyResultCheckIn>, timeUnit: WindowUnit = 'minutes'): Promise<number> {
    const previousCheckIn = await this.core.keyResult.getFromKeyResultCheckInID(checkIn.parentId)
    const keyResult = await this.core.keyResult.getFromIndexes({ id: checkIn.keyResultId })

    const nextDate = checkIn.createdAt
    const previousDate = previousCheckIn?.createdAt ?? keyResult.createdAt

    const differenceHandler = this.differenceHandlers[timeUnit]

    return differenceHandler(nextDate, previousDate)
  }
}
