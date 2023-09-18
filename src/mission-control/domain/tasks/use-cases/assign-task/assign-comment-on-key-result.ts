import { Injectable } from '@nestjs/common'

import { CoreProvider } from '@core/core.provider'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Task } from '@prisma/mission-control/generated'

import { COMMENT_KR_TASK_TEMPLATE_ID, COMMENT_KR_TASK_SCORE } from '../../constants'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

@Injectable()
export class AssignCommentOnKeyResultTask implements TaskAssigner {
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
      .leftJoinAndSelect(`${KeyResult.name}.comments`, 'comments')
      .andWhere('comments.createdAt <= :sevenDaysAgo', {
        sevenDaysAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 daias atrás
      })
      .getMany()

    if (keyResults.length === 0) return []
    const keyResultsIds = keyResults.map((keyResult) => keyResult.id)

    return [
      {
        userId: scope.userId,
        teamId: scope.teamId,
        weekId: scope.weekId,
        templateId: COMMENT_KR_TASK_TEMPLATE_ID,
        score: COMMENT_KR_TASK_SCORE,
        availableSubtasks: keyResultsIds,
        completedSubtasks: [],
      },
    ]
  }
}
