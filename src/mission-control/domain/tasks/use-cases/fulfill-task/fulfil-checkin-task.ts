import { Injectable } from '@nestjs/common'

import { CheckInEvent } from '@core/common/messaging/base-scenarios/checkin.event'
import { buildWeekId } from 'src/mission-control/helpers/build-week-id'

import { CHECK_IN_TASK_SINGLE_SUBTASK, CHECK_IN_TASK_TEMPLATE_ID } from '../../constants'
import { TaskRepository } from '../../repositories/task-repositoriy'
import { TaskId } from '../../types'

import { TaskFulfiller } from './base-scenario/task-fulfiller.abstract'

@Injectable()
export class FulfillCheckinTask implements TaskFulfiller<CheckInEvent> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async ingest(event: CheckInEvent): Promise<void> {
    const taskId: TaskId = {
      userId: event.userId,
      teamId: event.payload.teamId,
      weekId: buildWeekId(new Date(event.date)),
      templateId: CHECK_IN_TASK_TEMPLATE_ID,
    }

    await this.taskRepository.addSubtask(taskId, CHECK_IN_TASK_SINGLE_SUBTASK)
  }
}
