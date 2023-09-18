import { Injectable } from '@nestjs/common'
import { Raw } from 'typeorm'

import { CoreProvider } from '@core/core.provider'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { Task } from '@prisma/mission-control/generated'

import { EMPTY_DESCRIPTION_TASK_TEMPLATE_ID, EMPTY_DESCRIPTION_TASK_SCORE } from '../../constants'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

@Injectable()
export class AssignEmptyDescriptionTask implements TaskAssigner {
  constructor(private readonly core: CoreProvider) {}

  async assign(scope: TaskScope): Promise<Task[]> {
    const keyResults = await this.core.keyResult.getMany({
      ownerId: scope.userId,
      teamId: scope.teamId,
      mode: KeyResultMode.PUBLISHED,
      description: Raw((alias) => `${alias} IS NULL OR ${alias} = ''`),
    })

    if (keyResults.length === 0) return []
    const keyResultsIds = keyResults.map((keyResult) => keyResult.id)

    return [
      {
        userId: scope.userId,
        teamId: scope.teamId,
        weekId: scope.weekId,
        templateId: EMPTY_DESCRIPTION_TASK_TEMPLATE_ID,
        score: EMPTY_DESCRIPTION_TASK_SCORE,
        availableSubtasks: keyResultsIds,
        completedSubtasks: [],
      },
    ]
  }
}
