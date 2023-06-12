import { getManager } from 'typeorm'

import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { AuthorType } from '@core/modules/key-result/enums/key-result-author-type'
import { KeyResultPatchsKeys } from '@core/modules/key-result/enums/key-result-patch.enum'
import { KeyResultPatchInterface } from '@core/modules/key-result/interfaces/key-result-patch.interface'
import { KeyResultStateInterface } from '@core/modules/key-result/interfaces/key-result-state.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultUpdateInterface } from '@core/modules/key-result/update/key-result-update.interface'
import { KeyResultUpdate } from '@core/modules/key-result/update/key-result-update.orm-entity'

import { Command } from './base.command'

export class UpdateKeyResultCommand extends Command<KeyResult> {
  public async execute(
    id: string,
    userWithContext: UserWithContext,
    keyResult: Partial<KeyResultInterface>,
  ): Promise<KeyResult> {
    const entityManager = getManager()
    return entityManager.transaction(async (transactionEntityManager) => {
      const { title, description, format, mode, goal, type, ownerId } =
        await transactionEntityManager.findOne(KeyResult, id)

      const oldKeyResultState: KeyResultStateInterface = {
        mode,
        title,
        goal,
        format,
        type,
        ownerId,
        description,
      }

      const newKeyResultState: KeyResultStateInterface = {
        title: keyResult.title ?? title,
        mode: keyResult.mode ?? mode,
        goal: keyResult.goal ?? goal,
        format: keyResult.format ?? format,
        type: keyResult.type ?? type,
        ownerId: keyResult.ownerId ?? ownerId,
        description: keyResult.description ?? description,
      }

      const updatePatches: KeyResultPatchInterface[] = Object.keys(keyResult).map((key) => ({
        key: KeyResultPatchsKeys[key.toUpperCase()],
        value: keyResult[key],
      }))

      await transactionEntityManager.update<KeyResult>(KeyResult, id, keyResult)

      const keyResultUpdate: Partial<KeyResultUpdateInterface> = {
        createdAt: new Date(),
        keyResultId: id,
        author: {
          type: AuthorType.USER,
          identifier: userWithContext.id,
        },
        oldState: oldKeyResultState,
        patches: updatePatches,
        newState: newKeyResultState,
      }

      const marshalKeyResultUpdate = transactionEntityManager.create(
        KeyResultUpdate,
        keyResultUpdate,
      )
      await transactionEntityManager.save(KeyResultUpdate, marshalKeyResultUpdate)

      return transactionEntityManager.findOne(KeyResult, id)
    })
  }
}
