import { NotificationMetadata } from '@infrastructure/notification/types/notification-metadata.type'
import { Recipient } from '@infrastructure/notification/types/recipient.type'

export type MessageBrokerChannelMetadata = {
  message: string
  recipients: Recipient[]
} & NotificationMetadata
