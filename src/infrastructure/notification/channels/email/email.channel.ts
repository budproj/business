import { Injectable } from '@nestjs/common'

import { ChannelMetadata } from '@infrastructure/notification/types/channel-metadata.type'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationRecipient } from '@infrastructure/notification/types/recipient.type'

import { NotificationChannel } from '../channel.interface'

type EmailMetadata = {
  template: string
} & ChannelMetadata

@Injectable()
export class EmailNotificationChannel implements NotificationChannel {
  public async dispatch(
    data: NotificationData,
    recipient: NotificationRecipient[],
    metadata: EmailMetadata,
  ): Promise<void> {
    console.log('ok')
  }
}
