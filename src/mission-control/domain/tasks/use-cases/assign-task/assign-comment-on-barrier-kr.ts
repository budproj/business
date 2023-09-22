import { Injectable } from '@nestjs/common'

import { CoreProvider } from '@core/core.provider'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Task } from '@prisma/mission-control/generated'

import { COMMENT_BARRIER_KR_TASK_SCORE, COMMENT_BARRIER_KR_TASK_TEMPLATE_ID } from '../../constants'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

@Injectable()
export class AssignCommentOnBarrierKeyResultTask implements TaskAssigner {
  constructor(private readonly core: CoreProvider) {}

  async assign(scope: TaskScope): Promise<Task[]> {
    const team = await this.core.team.getFromID(scope.teamId)

    if (scope.userId !== team.ownerId) {
      return []
    }

    const queryBuilder = await this.core.keyResult.get({
      ownerId: scope.userId,
      teamId: scope.teamId,
    })

    const keyResults = await queryBuilder
      .leftJoin(
        `${KeyResult.name}.checkIns`,
        'checkIn',
        `checkIn.createdAt = (SELECT MAX(created_at) FROM key_result_check_in WHERE key_result_id = KeyResult.id)`,
      )
      .where('KeyResult.ownerId = :ownerId', { ownerId: scope.userId })
      .andWhere('KeyResult.teamId = :teamId', { teamId: scope.teamId })
      .andWhere('checkIn.confidence = :confidence', { confidence: -1 })
      .getMany()

    if (keyResults.length === 0) return []
    const keyResultsIds = keyResults.map((keyResult) => keyResult.id)

    return [
      {
        userId: scope.userId,
        teamId: scope.teamId,
        weekId: scope.weekId,
        templateId: COMMENT_BARRIER_KR_TASK_TEMPLATE_ID,
        score: COMMENT_BARRIER_KR_TASK_SCORE,
        availableSubtasks: keyResultsIds,
        completedSubtasks: [],
      },
    ]
  }
}
