import { Injectable } from '@nestjs/common'

import { EmptyDescriptionEvent } from '@core/common/messaging/base-scenarios/empty-description.event'
import { buildWeekId } from 'src/mission-control/helpers/build-week-id'

import { EMPTY_DESCRIPTION_TASK_TEMPLATE_ID } from '../../constants'
import { TaskRepository } from '../../repositories/task-repositoriy'
import { TaskId } from '../../types'

import { TaskFulfiller } from './base-scenario/task-fulfiller.abstract'

@Injectable()
export class FulfillEmptyDescriptionTask implements TaskFulfiller<EmptyDescriptionEvent> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async ingest(event: EmptyDescriptionEvent): Promise<void> {
    const taskId: TaskId = {
      companyId: event.companyId,
      userId: event.userId,
      teamId: event.payload.teamId,
      weekId: buildWeekId(new Date(event.date)),
      templateId: EMPTY_DESCRIPTION_TASK_TEMPLATE_ID,
    }

    void this.taskRepository.addSubtask(taskId, event.payload.keyResultId)
  }
}
