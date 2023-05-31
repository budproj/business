import { getManager } from 'typeorm'

import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { AuthorType } from '@core/modules/key-result/enums/key-result-author-type'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { KeyResultPatchsKeys } from '@core/modules/key-result/enums/key-result-patch.enum'
import { KeyResultPatchInterface } from '@core/modules/key-result/interfaces/key-result-patch.interface'
import { KeyResultStateInterface } from '@core/modules/key-result/interfaces/key-result-state.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultUpdateInterface } from '@core/modules/key-result/update/key-result-update.interface'
import { KeyResultUpdate } from '@core/modules/key-result/update/key-result-update.orm-entity'
import { ObjectiveMode } from '@core/modules/objective/enums/objective-mode.enum'
import { Objective } from '@core/modules/objective/objective.orm-entity'

import { Command } from './base.command'

export class PublishObjectiveAndKeyResultsCommand extends Command<Objective> {
  public async execute(id: string, userWithContext: UserWithContext): Promise<Objective> {
    const entityManager = getManager()

    return entityManager.transaction(async (transactionEntityManager) => {
      const publishedKeyResults: KeyResultUpdate[] = []

      const objective = await transactionEntityManager.findOne(Objective, id, {
        where: { mode: ObjectiveMode.DRAFT },
      })
      objective.mode = ObjectiveMode.PUBLISHED

      await transactionEntityManager.save(objective)

      const keyResults = await transactionEntityManager.find(KeyResult, {
        where: { objectiveId: id, mode: KeyResultMode.DRAFT },
      })

      for (const keyResult of keyResults) {
        const oldStateKeyResult: KeyResultStateInterface = {
          ...keyResult,
          description: keyResult.description ?? '',
          author: { type: AuthorType.USER, identifier: userWithContext.email },
        }
        const newStateKeyResult: KeyResultStateInterface = {
          ...oldStateKeyResult,
          mode: KeyResultMode.PUBLISHED,
        }

        const keyResultUpdatePatches: KeyResultPatchInterface[] = [
          {
            key: KeyResultPatchsKeys.MODE,
            value: KeyResultMode.PUBLISHED,
          },
        ]

        const keyResultUpdateInstance: Partial<KeyResultUpdateInterface> = {
          createdAt: new Date(),
          keyResultId: keyResult.id,
          oldState: oldStateKeyResult,
          patches: keyResultUpdatePatches,
          newState: newStateKeyResult,
        }

        const marshalKeyResultUpdate = transactionEntityManager.create(
          KeyResultUpdate,
          keyResultUpdateInstance,
        )

        publishedKeyResults.push(marshalKeyResultUpdate)

        keyResult.mode = KeyResultMode.PUBLISHED
        keyResult.lastUpdatedBy = { type: AuthorType.USER, identifier: userWithContext.email }
      }

      await transactionEntityManager.save(publishedKeyResults)
      await transactionEntityManager.save(keyResults)

      return objective
    })
  }
}
