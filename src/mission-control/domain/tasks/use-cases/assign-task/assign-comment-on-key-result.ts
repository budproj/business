import { Injectable } from '@nestjs/common'

import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultProvider } from '@core/modules/key-result/key-result.provider'
import { TeamProvider } from '@core/modules/team/team.provider'
import { Task } from '@prisma/mission-control/generated'

import { COMMENT_KR_TASK_TEMPLATE_ID, COMMENT_KR_TASK_SCORE } from '../../constants'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

@Injectable()
export class AssignCommentOnKeyResultTask implements TaskAssigner {
  constructor(
    private readonly keyResultRepository: KeyResultProvider,
    private readonly teamRepository: TeamProvider,
  ) {}

  async assign(scope: TaskScope): Promise<Task[]> {
    const team = await this.teamRepository.getFromID(scope.teamId)

    if (scope.userId !== team.ownerId) {
      return null
    }

    const queryBuilder = await this.keyResultRepository.get({
      ownerId: scope.userId,
      teamId: scope.teamId,
    })
    const keyResults = await queryBuilder
      .leftJoinAndSelect(`${KeyResult.name}.comments`, 'comments')
      .andWhere('comments.createdAt <= :sevenDaysAgo', {
        sevenDaysAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 daias atrás
      })
      .getMany()

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
