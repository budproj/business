import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { Injectable } from '@nestjs/common'

import { UserStatus } from '@core/modules/user/enums/user-status.enum'
import { UserInterface } from '@core/modules/user/user.interface'
import { MessageBrokerChannelMetadata } from '@infrastructure/notification/channels/message-broker/metadata.type'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { Recipient } from '@infrastructure/notification/types/recipient.type'

import { NotificationChannel } from '../channel.interface'

@Injectable()
export class MessageBrokerNotificationChannel
  implements NotificationChannel<MessageBrokerChannelMetadata>
{
  constructor(private readonly messageBrokerAdapter: AmqpConnection) {}

  public buildRecipientsFromUsers(users: UserInterface[]): Recipient[] {
    const activeUsers = users.filter((user) => user.status === UserStatus.ACTIVE)
    return activeUsers.map((user) => ({ id: user.authzSub, name: user.firstName }))
  }

  public async dispatch(topic: string, data: NotificationData): Promise<any> {
    return this.messageBrokerAdapter.publish('bud', topic, data)
  }

  public async dispatchMultiple(topic: string, data: NotificationData[]): Promise<any> {
    const messagesPromises = data.map(async (notification) => this.dispatch(topic, notification))

    const responses = await Promise.all(messagesPromises)
    return responses
  }
}
