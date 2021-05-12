import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'
import { NotificationProvider } from '@infrastructure/notification/notification.provider'
import { NotificationFactory } from '@infrastructure/notification/notifications/notification.factory'

@Module({
  imports: [CoreModule],
  providers: [NotificationProvider, NotificationFactory],
  exports: [NotificationProvider],
})
export class NotificationModule {}
