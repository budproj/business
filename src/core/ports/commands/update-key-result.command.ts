import { getConnection } from 'typeorm'

import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { EmptyDescriptionEvent } from '@core/common/messaging/base-scenarios/empty-description.event'
import { AuthorType } from '@core/modules/key-result/enums/key-result-author-type'
import { KeyResultPatchsKeys } from '@core/modules/key-result/enums/key-result-patch.enum'
import { KeyResultPatchInterface } from '@core/modules/key-result/interfaces/key-result-patch.interface'
import { KeyResultStateInterface } from '@core/modules/key-result/interfaces/key-result-state.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultUpdate } from '@core/modules/key-result/update/key-result-update.orm-entity'
import { EMPTY_DESCRIPTION_TASK_TEMPLATE_ID } from 'src/mission-control/domain/tasks/constants'

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

      const { title, description, format, mode, goal, type, ownerId, teamId } = oldKeyResult

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

      // Fiz aqui pois seria muito tempo de desenvolvimento para transferir ao provider.
      if (
        (description === '' || description === undefined) &&
        description !== keyResult.description
      ) {
        const [company] = await this.core.team.getAscendantsByIds([teamId], {})

        const messageInterface = {
          userId: ownerId,
          companyId: company.id,
          date: Date.now(),
          payload: {
            teamId,
            keyResultId: id,
          },
        }

        void this.core.keyResult.fulfillerTaskPublisher.publish<EmptyDescriptionEvent>(
          EMPTY_DESCRIPTION_TASK_TEMPLATE_ID,
          { ...messageInterface },
        )
      }

      return updatedKeyResult
    } catch {
      await queryRunner.rollbackTransaction()
      throw new Error('Update key result transaction error')
    } finally {
      await queryRunner.release()
    }
  }
}
