import { Injectable } from '@nestjs/common'

import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import { Stopwatch } from '@lib/logger/pino.decorator'
import { Task } from '@prisma/mission-control/generated'

import {
  COMMENT_LOW_CONFIDENCE_KR_TASK_TEMPLATE_ID,
  COMMENT_LOW_CONFIDENCE_KR_TASK_SCORE,
  COMMENT_LOW_CONFIDENCE_KR_TASK_SINGLE_SUBTASK,
} from '../../constants'
import { CoreDomainRepository } from '../../repositories/core-domain-repository'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

@Injectable()
export class AssignCommentOnLowConfidenceKeyResultTask implements TaskAssigner {
  constructor(private readonly coreDomainRepository: CoreDomainRepository) {}

  @Stopwatch({ includeReturn: true })
  async assign(scope: TaskScope): Promise<Task[]> {
    const keyResult = await this.coreDomainRepository.findOneKeyResultByConfidence({
      userId: scope.userId,
      teamId: scope.teamId,
      confidence: ConfidenceTag.LOW,
    })

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
