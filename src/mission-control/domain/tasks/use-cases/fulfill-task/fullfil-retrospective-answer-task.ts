import { Injectable } from '@nestjs/common'

import { buildWeekId } from 'src/mission-control/helpers/build-week-id'

import {
  RETROSPECTIVE_ANSWER_SINGLE_SUBTASK,
  RETROSPECTIVE_ANSWER_TASK_TEMPLATE_ID,
} from '../../constants'
import { Event } from '../../messaging/events'
import { TaskRepository } from '../../repositories/task-repositorie'
import { TaskId } from '../../types'

import { TaskFulfiller } from './base-scenario/task-fulfiller.abstract'

export type RetrospectiveAnswerEvent = Event<Record<string, unknown>>

@Injectable()
export class FulfillRetrospectiveAnswerTask implements TaskFulfiller<RetrospectiveAnswerEvent> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async ingest(event: RetrospectiveAnswerEvent): Promise<void> {
    const tasks = await this.taskRepository.findMany({
      userId: event.userId,
      weekId: buildWeekId(new Date(event.date)),
      templateId: RETROSPECTIVE_ANSWER_TASK_TEMPLATE_ID,
    })

    for (const task of tasks) {
      const taskId: TaskId = {
        companyId: task.companyId,
        userId: task.userId,
        teamId: task.teamId,
        weekId: task.weekId,
        templateId: task.templateId,
      }

      void this.taskRepository.addSubtask(taskId, RETROSPECTIVE_ANSWER_SINGLE_SUBTASK)
    }
  }
}