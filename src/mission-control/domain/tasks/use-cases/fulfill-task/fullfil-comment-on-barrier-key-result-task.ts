import { Injectable } from '@nestjs/common'

import { CommentOnBarrierKREvent } from '@core/common/messaging/base-scenarios/comment-on-barrier-kr.event'
import { CommentOnKREvent } from '@core/common/messaging/base-scenarios/comment-on-kr.event'
import { buildWeekId } from 'src/mission-control/helpers/build-week-id'

import { COMMENT_BARRIER_KR_TASK_TEMPLATE_ID } from '../../constants'
import { TaskRepository } from '../../repositories/task-repositoriy'
import { TaskId } from '../../types'

import { TaskFulfiller } from './base-scenario/task-fulfiller.abstract'

@Injectable()
export class FulfillCommenBarrierKeyResultTask implements TaskFulfiller<CommentOnBarrierKREvent> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async ingest(event: CommentOnKREvent): Promise<void> {
    const taskId: TaskId = {
      userId: event.userId,
      teamId: event.payload.teamId,
      weekId: buildWeekId(new Date(event.date)),
      templateId: COMMENT_BARRIER_KR_TASK_TEMPLATE_ID,
    }

    await this.taskRepository.addSubtask(taskId, event.payload.keyResultId)
  }
}
