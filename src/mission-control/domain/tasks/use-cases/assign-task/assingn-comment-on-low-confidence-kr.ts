import { Injectable } from '@nestjs/common'

import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultProvider } from '@core/modules/key-result/key-result.provider'
import { TeamProvider } from '@core/modules/team/team.provider'
import { Task } from '@prisma/mission-control/generated'

import {
  COMMENT_LOW_CONFIDENCE_KR_TASK_TEMPLATE_ID,
  COMMENT_LOW_CONFIDENCE_KR_TASK_SCORE,
} from '../../constants'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

@Injectable()
export class AssignCommentOnLowConfidenceKeyResultTask implements TaskAssigner {
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
      .leftJoin(
        `${KeyResult.name}.checkIns`,
        'checkIn',
        `checkIn.createdAt = (SELECT MAX(created_at) FROM key_result_check_in WHERE key_result_id = KeyResult.id)`,
      )
      .where('KeyResult.ownerId = :ownerId', { ownerId: scope.userId })
      .andWhere('KeyResult.teamId = :teamId', { teamId: scope.teamId })
      .andWhere('checkIn.confidence <= :confidence', { confidence: 32 })
      .andWhere('checkIn.confidence => :confidence', { confidence: 0 })
      .getMany()

    const keyResultsIds = keyResults.map((keyResult) => keyResult.id)

    return [
      {
        companyId: scope.companyId,
        userId: scope.userId,
        teamId: scope.teamId,
        weekId: scope.weekId,
        templateId: COMMENT_LOW_CONFIDENCE_KR_TASK_TEMPLATE_ID,
        score: COMMENT_LOW_CONFIDENCE_KR_TASK_SCORE,
        availableSubtasks: keyResultsIds,
        completedSubtasks: [],
      },
    ]
  }
}
