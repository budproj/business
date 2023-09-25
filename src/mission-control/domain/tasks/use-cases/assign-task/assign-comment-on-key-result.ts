import { Injectable } from '@nestjs/common'

import { CoreProvider } from '@core/core.provider'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Task } from '@prisma/mission-control/generated'

import {
  COMMENT_KR_TASK_TEMPLATE_ID,
  COMMENT_KR_TASK_SCORE,
  COMMENT_KR_TASK_SINGLE_SUBTASK,
} from '../../constants'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

@Injectable()
export class AssignCommentOnKeyResultTask implements TaskAssigner {
  constructor(private readonly core: CoreProvider) {}

  async assign(scope: TaskScope): Promise<Task[]> {
    const [companie] = await this.core.team.getAscendantsByIds([scope.teamId], {})

    if (!companie.id) {
      return []
    }

    const queryBuilder = await this.core.keyResult.get({
      teamId: companie.id,
    })

    const keyResult = await queryBuilder
      .innerJoin('KeyResult.objective', 'objective', 'objective.id = KeyResult.objective_id')
      .innerJoin('objective.cycle', 'cycle', 'cycle.id = objective.cycle_id')
      .leftJoinAndSelect(
        `${KeyResult.name}.comments`,
        'comments',
        'comments.created_at = (SELECT MAX(c.created_at) FROM key_result_comment c WHERE c.key_result_id = KeyResult.id)',
      )
      .where((qb) => {
        qb.andWhere({
          objective: {
            cycle: {
              active: true,
            },
          },
        })
        qb.andHaving(
          '(comments.created_at IS NOT NULL AND comments.created_at < :sevenDaysAgo) OR (comments.created_at IS NULL AND KeyResult.created_at < :sevenDaysAgo)',
          {
            sevenDaysAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        )
      })
      .groupBy('KeyResult.id')
      .addGroupBy('comments.id')
      .getOne()

    if (!keyResult) return []

    return [
      {
        userId: scope.userId,
        teamId: companie.id,
        weekId: scope.weekId,
        templateId: COMMENT_KR_TASK_TEMPLATE_ID,
        score: COMMENT_KR_TASK_SCORE,
        availableSubtasks: [COMMENT_KR_TASK_SINGLE_SUBTASK],
        completedSubtasks: [],
      },
    ]
  }
}
