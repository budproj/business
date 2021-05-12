import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationMetadata } from '@infrastructure/notification/types/notification-metadata.type'

export type Notification = {
  data: NotificationData
  metadata: NotificationMetadata
}
