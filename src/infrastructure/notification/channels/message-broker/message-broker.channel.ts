import { Injectable } from '@nestjs/common'

import { MessageBrokerAdapterProvider } from '@adapters/message-broker/message-broker.provider'
import { UserStatus } from '@core/modules/user/enums/user-status.enum'
import { UserInterface } from '@core/modules/user/user.interface'
import { NatsProvider } from '@infrastructure/nats/nats.provider'
import { MessageBrokerChannelMetadata } from '@infrastructure/notification/channels/message-broker/metadata.type'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { Recipient } from '@infrastructure/notification/types/recipient.type'

import { NotificationChannel } from '../channel.interface'

@Injectable()
export class MessageBrokerNotificationChannel
  implements NotificationChannel<MessageBrokerChannelMetadata>
{
  private readonly messageBrokerAdapter: MessageBrokerAdapterProvider

  constructor(provider: NatsProvider) {
    this.messageBrokerAdapter = new MessageBrokerAdapterProvider(provider)
  }

  public buildRecipientsFromUsers(users: UserInterface[]): Recipient[] {
    const activeUsers = users.filter((user) => user.status === UserStatus.ACTIVE)
    return activeUsers.map((user) => ({ id: user.authzSub, name: user.firstName }))
  }

  public async dispatch(topic: string, data: NotificationData): Promise<void> {
    await this.messageBrokerAdapter.publish(topic, data)
  }

  public async dispatchMultiple(topic: string, data: NotificationData[]): Promise<void> {
    const messagesPromises = data
      .map((notification) => JSON.stringify(notification))
      .map(async (notification) => this.dispatch(topic, notification))

    await Promise.all(messagesPromises)
  }
}
