import { getManager } from 'typeorm'

import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { ObjectiveMode } from '@core/modules/objective/enums/objective-mode.enum'
import { Objective } from '@core/modules/objective/objective.orm-entity'

import { Command } from './base.command'

export class PublishObjectiveAndKeyResultsCommand extends Command<Objective> {
  public async execute(id: string): Promise<Objective> {
    const entityManager = getManager()

    return entityManager.transaction(async (transactionEntityManager) => {
      const updatedObjectiveResult = await transactionEntityManager
        .createQueryBuilder()
        .update(Objective)
        .set({ mode: ObjectiveMode.PUBLISHED })
        .where('id = :id AND mode = :mode', { id, mode: ObjectiveMode.DRAFT })
        .returning('*')
        .execute()

      await transactionEntityManager
        .createQueryBuilder()
        .update(KeyResult)
        .set({ mode: KeyResultMode.PUBLISHED })
        .where('objective_id = :objective_id AND mode = :mode', {
          objective_id: id,
          mode: KeyResultMode.DRAFT,
        })
        .execute()

      const objective = updatedObjectiveResult.raw[0]

      return objective
    })
  }
}
