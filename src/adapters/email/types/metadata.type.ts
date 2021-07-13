import { ActivityMetadata } from '@adapters/activity/types/activity-metadata.type'
import { NotificationRecipient } from '@infrastructure/notification/types/recipient.type'

export type EmailMetadata = {
  recipients: NotificationRecipient[]
  template: string
} & ActivityMetadata
