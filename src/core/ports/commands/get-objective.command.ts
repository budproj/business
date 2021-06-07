import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'

import { Command } from './base.command'

export class GetObjectiveCommand extends Command<Objective> {
  public async execute(indexes: Partial<ObjectiveInterface>): Promise<Objective> {
    return this.core.objective.getFromIndexes(indexes)
  }
}
