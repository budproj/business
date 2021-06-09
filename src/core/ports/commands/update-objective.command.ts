import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'

import { Command } from './base.command'

export class UpdateObjectiveCommand extends Command<Objective> {
  public async execute(id: string, objective: Partial<ObjectiveInterface>): Promise<Objective> {
    return this.core.objective.update({ id }, objective)
  }
}
