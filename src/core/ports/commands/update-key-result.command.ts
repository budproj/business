import { getConnection } from 'typeorm'

import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { AuthorType } from '@core/modules/key-result/enums/key-result-author-type'
import { KeyResultPatchsKeys } from '@core/modules/key-result/enums/key-result-patch.enum'
import { KeyResultPatchInterface } from '@core/modules/key-result/interfaces/key-result-patch.interface'
import { KeyResultStateInterface } from '@core/modules/key-result/interfaces/key-result-state.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultUpdate } from '@core/modules/key-result/update/key-result-update.orm-entity'

import { Command } from './base.command'

export class UpdateKeyResultCommand extends Command<KeyResult> {
  public async execute(
    id: string,
    userWithContext: UserWithContext,
    keyResult: Partial<KeyResultInterface>,
  ): Promise<KeyResult> {
    const connection = getConnection()
    const queryRunner = connection.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      const oldKeyResult = await queryRunner.manager.findOne(KeyResult, id)

      const { title, description, format, mode, goal, type, ownerId } = oldKeyResult

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
        key: KeyResultPatchsKeys[key],
        value: keyResult[key],
      }))

      await queryRunner.manager
        .createQueryBuilder()
        .update(KeyResult)
        .set(keyResult)
        .where({ id })
        .execute()

      const keyResultUpdate = {
        keyResultId: id,
        author: {
          type: AuthorType.USER,
          identifier: userWithContext.id,
        },
        oldState: oldKeyResultState,
        patches: updatePatches,
        newState: newKeyResultState,
      }

      const keyResultUpdateInstance = queryRunner.manager.create(KeyResultUpdate, keyResultUpdate)

      await queryRunner.manager.save(KeyResultUpdate, keyResultUpdateInstance)

      await queryRunner.commitTransaction()

      const updatedKeyResult = { ...oldKeyResult, ...keyResult }

      return updatedKeyResult
    } catch {
      await queryRunner.rollbackTransaction()
      throw new Error('Update key result transaction error')
    } finally {
      await queryRunner.release()
    }
  }
}
