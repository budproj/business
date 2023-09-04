/* eslint-disable @typescript-eslint/no-floating-promises */
import { Injectable, OnModuleInit } from '@nestjs/common'

import { CheckInEvent } from '@core/common/messaging/base-scenarios/checkin.event.js'
import { CHECK_IN_TASK_TEMPLATE_ID } from '@core/common/mission-control/tasks-template/constants'

import { EventSubscriber } from '../messaging/events.js'
import { FulfillCheckinTask } from '../use-cases/fulfill-task/fulfil-checkin-task.js'

@Injectable()
export class TaskFulfillerService implements OnModuleInit {
  constructor(
    private readonly fulfillCheckInTask: FulfillCheckinTask,
    private readonly fulfillEventSubscriber: EventSubscriber,
  ) {}

  async onModuleInit() {
    this.fulfillEventSubscriber.subscribe<CheckInEvent>(
      CHECK_IN_TASK_TEMPLATE_ID,
      async (event) => {
        await this.fulfillCheckInTask.ingest(event)
      },
    )
  }
}
