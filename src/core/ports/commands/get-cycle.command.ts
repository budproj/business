import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'

import { Command } from './base.command'

export class GetCycleCommand extends Command<Cycle> {
  public async execute(indexes: Partial<CycleInterface>): Promise<Cycle> {
    const cycle = await this.core.cycle.getFromIndexes(indexes)

    return cycle
  }
}
