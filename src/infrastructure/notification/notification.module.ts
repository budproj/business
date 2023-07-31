import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'
import { UserModule } from '@core/modules/user/user.module'
import { AWSModule } from '@infrastructure/aws/aws.module'
import { EmailNotificationChannel } from '@infrastructure/notification/channels/email/email.channel'
import { MessageBrokerNotificationChannel } from '@infrastructure/notification/channels/message-broker/message-broker.channel'
import { NotificationProvider } from '@infrastructure/notification/notification.provider'
import { NotificationFactory } from '@infrastructure/notification/notifications/notification.factory'
import { RabbitMQClient } from '@interface/nats/client'

@Module({
  imports: [CoreModule, AWSModule, RabbitMQClient, UserModule],
  providers: [
    NotificationProvider,
    NotificationFactory,
    EmailNotificationChannel,
    MessageBrokerNotificationChannel,
  ],
  exports: [NotificationProvider],
})
export class NotificationModule {}
