import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'
import { AWSModule } from '@infrastructure/aws/aws.module'
import { EmailNotificationChannel } from '@infrastructure/notification/channels/email/email.channel'
import { NotificationProvider } from '@infrastructure/notification/notification.provider'
import { NotificationFactory } from '@infrastructure/notification/notifications/notification.factory'

@Module({
  imports: [CoreModule, AWSModule],
  providers: [NotificationProvider, NotificationFactory, EmailNotificationChannel],
  exports: [NotificationProvider],
})
export class NotificationModule {}
