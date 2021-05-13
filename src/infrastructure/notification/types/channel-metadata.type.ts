import { NotificationMetadata } from '@infrastructure/notification/types/notification-metadata.type'
import { NotificationRecipient } from '@infrastructure/notification/types/recipient.type'

export type ChannelMetadata = {
  recipients: NotificationRecipient[]
} & NotificationMetadata
