import { getConnection } from 'typeorm'

import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { AuthorType } from '@core/modules/key-result/enums/key-result-author-type'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { KeyResultPatchsKeys } from '@core/modules/key-result/enums/key-result-patch.enum'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultUpdate } from '@core/modules/key-result/update/key-result-update.orm-entity'
import { ObjectiveMode } from '@core/modules/objective/enums/objective-mode.enum'
import { Objective } from '@core/modules/objective/objective.orm-entity'

import { Command } from './base.command'

export class PublishObjectiveAndKeyResultsCommand extends Command<Objective> {
  public async execute(id: string, userWithContext: UserWithContext): Promise<Objective> {
    const connection = getConnection()
    const queryRunner = connection.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      const updatedObjective = await queryRunner.manager
        .createQueryBuilder()
        .update(Objective)
        .set({ mode: ObjectiveMode.PUBLISHED })
        .where({ id, mode: ObjectiveMode.DRAFT })
        .returning('*')
        .execute()

      const keyResults = await queryRunner.manager
        .getRepository(KeyResult)
        .find({ where: { objectiveId: id } })

      const keyResultUpdates = keyResults.map(
        ({ id, mode, title, goal, format, type, ownerId, description }) => {
          const state = {
            mode,
            title,
            goal,
            format,
            type,
            ownerId,
            description,
            author: { type: AuthorType.USER, identifier: userWithContext.id },
          }

          return {
            keyResultId: id,
            author: {
              type: AuthorType.USER,
              identifier: userWithContext.id,
            },
            oldState: state,
            patches: [{ key: KeyResultPatchsKeys.mode, value: KeyResultMode.PUBLISHED }],
            newState: { ...state, mode: KeyResultMode.PUBLISHED },
          }
        },
      )

      await queryRunner.manager
        .getRepository(KeyResultUpdate)
        .createQueryBuilder()
        .insert()
        .values(keyResultUpdates)
        .execute()

      await queryRunner.manager
        .createQueryBuilder()
        .update(KeyResult)
        .set({
          mode: KeyResultMode.PUBLISHED,
          lastUpdatedBy: { type: AuthorType.USER, identifier: userWithContext.id },
        })
        .where({ objectiveId: id, mode: KeyResultMode.DRAFT })
        .execute()

      await queryRunner.commitTransaction()

      return updatedObjective.raw[0]
    } catch {
      await queryRunner.rollbackTransaction()
      throw new Error('Publish OKR transaction error')
    } finally {
      await queryRunner.release()
    }
  }
}
