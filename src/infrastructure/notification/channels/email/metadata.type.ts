import { ChannelMetadata } from '@infrastructure/notification/types/channel-metadata.type'

export type EmailNotificationChannelMetadata = {
  template: string
} & ChannelMetadata
