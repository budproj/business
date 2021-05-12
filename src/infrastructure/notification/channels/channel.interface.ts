import { ChannelMetadata } from '@infrastructure/notification/types/channel-metadata.type'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'

export interface NotificationChannel {
  dispatch(data: NotificationData, metadata: ChannelMetadata): Promise<void>
}
