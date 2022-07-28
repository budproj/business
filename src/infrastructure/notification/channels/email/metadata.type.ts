import { ChannelMetadata } from '@infrastructure/notification/types/channel-metadata.type'
import { EmailRecipient } from '@infrastructure/notification/types/email-recipient.type'

export type EmailNotificationChannelMetadata = {
  template: string
  recipients: EmailRecipient[]
} & ChannelMetadata
