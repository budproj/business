import { Module } from '@nestjs/common'

import { NatsClient } from '@config/tasks/client'
import { CoreModule } from '@core/core.module'
import { AWSModule } from '@infrastructure/aws/aws.module'
import { EmailNotificationChannel } from '@infrastructure/notification/channels/email/email.channel'
import { MessageBrokerNotificationChannel } from '@infrastructure/notification/channels/message-broker/message-broker.channel'
import { NotificationProvider } from '@infrastructure/notification/notification.provider'
import { NotificationFactory } from '@infrastructure/notification/notifications/notification.factory'

@Module({
  imports: [CoreModule, AWSModule, NatsClient],
  providers: [
    NotificationProvider,
    NotificationFactory,
    EmailNotificationChannel,
    MessageBrokerNotificationChannel,
  ],
  exports: [NotificationProvider],
})
export class NotificationModule {}
