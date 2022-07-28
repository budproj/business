import { UserInterface } from '@core/modules/user/user.interface'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationMetadata } from '@infrastructure/notification/types/notification-metadata.type'
import { Recipient } from '@infrastructure/notification/types/recipient.type'

export interface NotificationChannel<
  M extends NotificationMetadata,
  D extends NotificationData | Array<Record<string, any>> = NotificationData,
  R extends Recipient = Recipient,
> {
  dispatch(data: D, metadata: M): Promise<void>
  buildRecipientsFromUsers(users: UserInterface[], metadata: Array<Record<string, any>>): R[]
}
