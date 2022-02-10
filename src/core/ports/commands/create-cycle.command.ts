import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'

import { Command } from './base.command'

export class CreateCycleCommand extends Command<Cycle> {
  public async execute(data: CycleInterface): Promise<Cycle> {
    return this.core.cycle.createCycle(data)
  }
}
