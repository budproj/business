import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationMetadata } from '@infrastructure/notification/types/notification-metadata.type'

export interface Notification<
  D extends NotificationData = NotificationData,
  M extends NotificationMetadata = NotificationMetadata,
> {
  data: D
  metadata: M
}
