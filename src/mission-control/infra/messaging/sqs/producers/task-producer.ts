import { Injectable } from '@nestjs/common'

import { AWSSQSProvider } from '@infrastructure/aws/sqs/sqs.provider'
import { TaskCreationProducer } from 'src/mission-control/domain/tasks/messaging/task-queue'
import { TaskScope } from 'src/mission-control/domain/tasks/types'

@Injectable()
export class SQSTaskCreationProducer implements TaskCreationProducer {
  constructor(private readonly remote: AWSSQSProvider) {}

  async produce(queue: string, scope: TaskScope): Promise<void> {
    void this.remote.send(queue, JSON.stringify(scope))
  }
}
