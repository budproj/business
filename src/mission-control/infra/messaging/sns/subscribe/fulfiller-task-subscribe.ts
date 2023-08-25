import { Injectable } from '@nestjs/common'

import { MessageException } from '@adapters/message-broker/types'
import { AWSSNSProvider } from '@infrastructure/aws/sns/sns.provider'
import { Event, EventSubscriber } from 'src/mission-control/domain/tasks/messaging/events'

@Injectable()
export class SNSFulfillerTaskSubscribe implements EventSubscriber {
  constructor(private readonly remote: AWSSNSProvider) {}

  subscribe<T extends Event>(
    topic: string,
    callback: (excepion: MessageException, event: T) => void,
  ): void {
    void this.remote.receive(topic, callback, 'sqs')
  }
}
