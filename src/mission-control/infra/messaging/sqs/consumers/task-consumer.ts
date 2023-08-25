import { Injectable } from '@nestjs/common'

import { MessageException } from '@adapters/message-broker/types'
import { AWSSQSProvider } from '@infrastructure/aws/sqs/sqs.provider'
import { TaskCreationConsumer } from 'src/mission-control/domain/tasks/messaging/task-queue'
import { TaskScope } from 'src/mission-control/domain/tasks/types'

@Injectable()
export class SQSTaskCreationConsumer implements TaskCreationConsumer {
  constructor(private readonly remote: AWSSQSProvider) {}

  consume(queue: string, callback: (excepion: MessageException, scope: TaskScope) => void): void {
    void this.remote.receive(queue, callback)
  }
}
