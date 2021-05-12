import { NotificationRecipient } from '@infrastructure/notification/types/recipient.type'

export type ChannelMetadata = {
  recipients: NotificationRecipient[]
} & Record<string, any>
