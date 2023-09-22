import { Injectable } from '@nestjs/common'

import { CoreProvider } from '@core/core.provider'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { Task } from '@prisma/mission-control/generated'

import { CHECK_IN_TASK_SCORE, CHECK_IN_TASK_TEMPLATE_ID } from '../../constants'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

@Injectable()
export class AssignCheckinTask implements TaskAssigner {
  constructor(private readonly core: CoreProvider) {}

  async assign(scope: TaskScope): Promise<Task[]> {
    const keyResults: Array<Partial<KeyResultInterface>> =
      await this.core.keyResult.getManyWithOutdatedCheckin({
        ownerId: scope.userId,
        teamId: scope.teamId,
        mode: KeyResultMode.PUBLISHED,
      })

    if (keyResults.length === 0) return []
    const keyResultsIds = keyResults.map((keyResult) => keyResult.id)

    return [
      {
        userId: scope.userId,
        teamId: scope.teamId,
        weekId: scope.weekId,
        templateId: CHECK_IN_TASK_TEMPLATE_ID,
        score: CHECK_IN_TASK_SCORE,
        availableSubtasks: keyResultsIds,
        completedSubtasks: [],
      },
    ]
  }
}
