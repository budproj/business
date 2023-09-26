import { Injectable } from '@nestjs/common'

import { Stopwatch } from '@lib/logger/pino.decorator'
import { Task } from '@prisma/mission-control/generated'

import {
  CHECK_IN_TASK_SCORE,
  CHECK_IN_TASK_SINGLE_SUBTASK,
  CHECK_IN_TASK_TEMPLATE_ID,
} from '../../constants'
import { CoreDomainRepository } from '../../repositories/core-domain-repository'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

@Injectable()
export class AssignCheckinTask implements TaskAssigner {
  constructor(private readonly coreDomainRepository: CoreDomainRepository) {}

  @Stopwatch({ includeReturn: true })
  async assign(scope: TaskScope): Promise<Task[]> {
    const keyResult = await this.coreDomainRepository.findOneKeyResultWithOutdatedCheckin({
      ownerId: scope.userId,
      teamId: scope.teamId,
    })

    if (!keyResult) return []

    return [
      {
        userId: scope.userId,
        teamId: scope.teamId,
        weekId: scope.weekId,
        templateId: CHECK_IN_TASK_TEMPLATE_ID,
        score: CHECK_IN_TASK_SCORE,
        availableSubtasks: [CHECK_IN_TASK_SINGLE_SUBTASK],
        completedSubtasks: [],
      },
    ]
  }
}
