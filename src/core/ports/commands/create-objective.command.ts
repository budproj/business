import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'

import { Command } from './base.command'

export class CreateObjectiveCommand extends Command<Objective> {
  public async execute(data: ObjectiveInterface): Promise<Objective> {
    return this.core.objective.createObjective(data)
  }
}
