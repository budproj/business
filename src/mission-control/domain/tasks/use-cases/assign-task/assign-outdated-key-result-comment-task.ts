import { Injectable } from '@nestjs/common'

import { CoreProvider } from '@core/core.provider'
import { Task } from '@prisma/mission-control/generated'

import {
  OUTDATED_KEY_RESULT_COMMENT_TASK_SCORE,
  OUTDATED_KEY_RESULT_COMMENT_TEMPLATE_ID,
} from '../../constants'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'
import { Stopwatch } from '@lib/logger/pino.decorator';

@Injectable()
export class AssignOutdatedKeyResultCommentTask implements TaskAssigner {
  constructor(private readonly core: CoreProvider) {}

  @Stopwatch({ includeReturn: true })
  async assign(scope: TaskScope): Promise<Task[]> | null {
    return [
      {
        userId: scope.userId,
        teamId: scope.teamId,
        weekId: scope.weekId,
        templateId: OUTDATED_KEY_RESULT_COMMENT_TEMPLATE_ID,
        score: OUTDATED_KEY_RESULT_COMMENT_TASK_SCORE,
        availableSubtasks: [],
        completedSubtasks: [],
      },
    ]
  }
}
