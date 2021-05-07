import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

export class GetKeyResultCycleCommand extends Command<Cycle> {
  public async execute(keyResult: KeyResult): Promise<Cycle> {
    const objective = await this.core.objective.getFromKeyResult(keyResult)
    const cycle = await this.core.cycle.getFromObjective(objective)

    return cycle
  }
}
