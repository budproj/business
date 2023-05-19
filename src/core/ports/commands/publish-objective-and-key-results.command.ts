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
      const objective = await transactionEntityManager.findOne(Objective, id, {
        where: { mode: ObjectiveMode.DRAFT },
      })
      objective.mode = ObjectiveMode.PUBLISHED

      await transactionEntityManager.save(objective)

      const keyResults = await transactionEntityManager.find(KeyResult, {
        where: { objectiveId: id, mode: KeyResultMode.DRAFT },
      })

      for (const keyResult of keyResults) {
        keyResult.mode = KeyResultMode.PUBLISHED
      }

      await transactionEntityManager.save(keyResults)

      return objective
    })
  }
}
