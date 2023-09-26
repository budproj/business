import { Injectable } from '@nestjs/common'

import { Task } from '@prisma/mission-control/generated'

import {
  RETROSPECTIVE_ANSWER_SINGLE_SUBTASK,
  RETROSPECTIVE_ANSWER_TASK_SCORE,
  RETROSPECTIVE_ANSWER_TASK_TEMPLATE_ID,
} from '../../constants'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'
import { Stopwatch } from '@lib/logger/pino.decorator';

@Injectable()
export class AssignRetrospectiveAnswerTask implements TaskAssigner {
  @Stopwatch({ includeReturn: true })
  async assign(scope: TaskScope): Promise<Task[]> | null {
    return [
      {
        userId: scope.userId,
        teamId: scope.teamId,
        weekId: scope.weekId,
        templateId: RETROSPECTIVE_ANSWER_TASK_TEMPLATE_ID,
        score: RETROSPECTIVE_ANSWER_TASK_SCORE,
        availableSubtasks: [RETROSPECTIVE_ANSWER_SINGLE_SUBTASK],
        completedSubtasks: [],
      },
    ]
  }
}
