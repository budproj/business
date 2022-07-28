import { MessageBrokerInterface } from '@adapters/message-broker/interface/message-broker.interface'
import { MessageData } from '@adapters/message-broker/types/message-data.type'

export class MessageBrokerAdapterProvider {
  constructor(private readonly provider: MessageBrokerInterface) {}

  public async publish(topic: string, data: MessageData): Promise<void> {
    return this.provider.publish(topic, data)
  }
}
