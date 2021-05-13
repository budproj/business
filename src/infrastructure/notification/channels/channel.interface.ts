import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationMetadata } from '@infrastructure/notification/types/notification-metadata.type'

export interface NotificationChannel<
  M extends NotificationMetadata,
  D extends NotificationData = NotificationData
> {
  dispatch(data: D, metadata: M): Promise<void>
}
