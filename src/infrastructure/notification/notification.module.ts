import { Module } from '@nestjs/common'

import { NotificationProvider } from '@infrastructure/notification/notification.provider'

@Module({
  providers: [NotificationProvider],
  exports: [NotificationProvider],
})
export class NotificationModule {}
