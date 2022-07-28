import { ActivityMetadata } from '@adapters/activity/types/activity-metadata.type'
import { EmailRecipient } from '@infrastructure/notification/types/email-recipient.type'

export type EmailMetadata = {
  recipients: EmailRecipient[]
  template: string
} & ActivityMetadata
