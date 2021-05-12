import { ChannelMetadata } from '@infrastructure/notification/types/channel-metadata.type'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationRecipient } from '@infrastructure/notification/types/recipient.type'

export interface NotificationChannel {
  dispatch(
    data: NotificationData,
    recipients: NotificationRecipient[],
    metadata: ChannelMetadata,
  ): Promise<void>
}
