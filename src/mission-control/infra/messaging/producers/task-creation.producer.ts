import { Injectable } from '@nestjs/common'
import { SqsService } from '@ssut/nestjs-sqs'
import * as uuid from 'uuid'

import { Stopwatch } from '@lib/logger/pino.decorator'
import { TaskCreationProducer } from 'src/mission-control/domain/tasks/messaging/task-queue'
import { TaskScope } from 'src/mission-control/domain/tasks/types'

@Injectable()
export class SQSTaskCreationProducer implements TaskCreationProducer {
  constructor(private readonly sqsService: SqsService) {}

  @Stopwatch()
  async produce(scope: TaskScope): Promise<void> {
    try {
      await this.sqsService.send(process.env.AWS_SQS_CREATE_TASK_QUEUE_NAME, {
        id: uuid.v4(),
        body: { scope },
        delaySeconds: 0,
      })
    } catch (error: unknown) {
      throw new Error(`Failed to produce message to SQS: ${JSON.stringify(error)}`)
    }
  }
}
