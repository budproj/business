import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'

import { Command } from './base.command'

export class UpdateCycleCommand extends Command<Cycle> {
  public async execute(id: string, cycle: Partial<CycleInterface>): Promise<Cycle> {
    return this.core.cycle.update({ id }, cycle)
  }
}
