import { Injectable, OnModuleInit } from '@nestjs/common'

import { CheckInEvent } from '@core/common/messaging/base-scenarios/checkin.event.js'
import { CHECK_IN_TASK_TEMPLATE_ID } from '@core/common/mission-control/tasks-template/constants'

import {
  COMMENT_BARRIER_KR_TASK_TEMPLATE_ID,
  COMMENT_KR_TASK_TEMPLATE_ID,
  COMMENT_LOW_CONFIDENCE_KR_TASK_TEMPLATE_ID,
  EMPTY_DESCRIPTION_TASK_TEMPLATE_ID,
} from '../constants.js'
import { EventSubscriber } from '../messaging/events.js'
import { FulfillCheckinTask } from '../use-cases/fulfill-task/fulfil-checkin-task.js'
import { FulfillCommenBarrierKeyResultTask } from '../use-cases/fulfill-task/fullfil-comment-on-barrier-key-result-task.js'
import { FulfillCommentOnKeyResultTask } from '../use-cases/fulfill-task/fullfil-comment-on-key-result-task.js'
import { FulfillCommentOnLowConfidenceKeyResultTask } from '../use-cases/fulfill-task/fullfil-comment-on-low-confidence-key-result-task.js'
import { FulfillEmptyDescriptionTask } from '../use-cases/fulfill-task/fullfil-empty-description-task.js'

@Injectable()
export class TaskFulfillerService implements OnModuleInit {
  constructor(
    private readonly fulfillCheckInTask: FulfillCheckinTask,
    private readonly fulfillCommentOnKeyResultTask: FulfillCommentOnKeyResultTask,
    private readonly fulfillCommenBarrierKeyResultTask: FulfillCommenBarrierKeyResultTask,
    private readonly fulfillCommentOnLowConfidenceKeyResultTask: FulfillCommentOnLowConfidenceKeyResultTask,
    private readonly fulfillEmptyDescriptionTask: FulfillEmptyDescriptionTask,
    private readonly fulfillEventSubscriber: EventSubscriber,
  ) {}

  async onModuleInit() {
    await this.fulfillEventSubscriber.subscribe<CheckInEvent>(
      CHECK_IN_TASK_TEMPLATE_ID,
      async (event) => {
        await this.fulfillCheckInTask.ingest(event)
      },
    )
    await this.fulfillEventSubscriber.subscribe<CheckInEvent>(
      COMMENT_KR_TASK_TEMPLATE_ID,
      async (event) => {
        await this.fulfillCommentOnKeyResultTask.ingest(event)
      },
    )
    await this.fulfillEventSubscriber.subscribe<CheckInEvent>(
      COMMENT_BARRIER_KR_TASK_TEMPLATE_ID,
      async (event) => {
        await this.fulfillCommenBarrierKeyResultTask.ingest(event)
      },
    )
    await this.fulfillEventSubscriber.subscribe<CheckInEvent>(
      COMMENT_LOW_CONFIDENCE_KR_TASK_TEMPLATE_ID,
      async (event) => {
        await this.fulfillCommentOnLowConfidenceKeyResultTask.ingest(event)
      },
    )
    await this.fulfillEventSubscriber.subscribe<CheckInEvent>(
      EMPTY_DESCRIPTION_TASK_TEMPLATE_ID,
      async (event) => {
        await this.fulfillEmptyDescriptionTask.ingest(event)
      },
    )
  }
}
