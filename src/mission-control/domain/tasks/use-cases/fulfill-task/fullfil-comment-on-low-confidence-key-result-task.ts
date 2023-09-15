import { Injectable } from '@nestjs/common'

import { CommentOnKREvent } from '@core/common/messaging/base-scenarios/comment-on-kr.event'
import { CommentOnLowConfidenceKREvent } from '@core/common/messaging/base-scenarios/comment-on-low-confidence-kr.event'
import { buildWeekId } from 'src/mission-control/helpers/build-week-id'

import { COMMENT_LOW_CONFIDENCE_KR_TASK_TEMPLATE_ID } from '../../constants'
import { TaskRepository } from '../../repositories/task-repositoriy'
import { TaskId } from '../../types'

import { TaskFulfiller } from './base-scenario/task-fulfiller.abstract'

@Injectable()
export class FulfillCommentOnLowConfidenceKeyResultTask
  implements TaskFulfiller<CommentOnLowConfidenceKREvent>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async ingest(event: CommentOnKREvent): Promise<void> {
    const taskId: TaskId = {
      companyId: event.companyId,
      userId: event.userId,
      teamId: event.payload.teamId,
      weekId: buildWeekId(new Date(event.date)),
      templateId: COMMENT_LOW_CONFIDENCE_KR_TASK_TEMPLATE_ID,
    }

    void this.taskRepository.addSubtask(taskId, event.payload.keyResultId)
  }
}
