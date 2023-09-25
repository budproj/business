import { Injectable } from '@nestjs/common'

import { CoreProvider } from '@core/core.provider'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Task } from '@prisma/mission-control/generated'

import {
  COMMENT_LOW_CONFIDENCE_KR_TASK_TEMPLATE_ID,
  COMMENT_LOW_CONFIDENCE_KR_TASK_SCORE,
  COMMENT_LOW_CONFIDENCE_KR_TASK_SINGLE_SUBTASK,
} from '../../constants'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

@Injectable()
export class AssignCommentOnLowConfidenceKeyResultTask implements TaskAssigner {
  constructor(private readonly core: CoreProvider) {}

  async assign(scope: TaskScope): Promise<Task[]> {
    const team = await this.core.team.getFromID(scope.teamId)

    if (scope.userId !== team.ownerId) {
      return []
    }

    const queryBuilder = await this.core.keyResult.get({
      teamId: scope.teamId,
    })

    const keyResult = await queryBuilder
      .innerJoin('KeyResult.objective', 'objective', 'objective.id = KeyResult.objective_id')
      .innerJoin('objective.cycle', 'cycle', 'cycle.id = objective.cycle_id')
      .leftJoin(
        `${KeyResult.name}.checkIns`,
        'checkIn',
        `checkIn.createdAt = (SELECT MAX(created_at) FROM key_result_check_in WHERE key_result_id = KeyResult.id)`,
      )
      .where({
        objective: {
          cycle: {
            active: true,
          },
        },
      })
      .andWhere('KeyResult.teamId = :teamId', { teamId: scope.teamId })
      .andWhere('checkIn.confidence <= :confidence', { confidence: 32 })
      .andWhere('checkIn.confidence >= :confidence', { confidence: 0 })
      .getOne()

    if (!keyResult) return []

    return [
      {
        userId: scope.userId,
        teamId: scope.teamId,
        weekId: scope.weekId,
        templateId: COMMENT_LOW_CONFIDENCE_KR_TASK_TEMPLATE_ID,
        score: COMMENT_LOW_CONFIDENCE_KR_TASK_SCORE,
        availableSubtasks: [COMMENT_LOW_CONFIDENCE_KR_TASK_SINGLE_SUBTASK],
        completedSubtasks: [],
      },
    ]
  }
}
