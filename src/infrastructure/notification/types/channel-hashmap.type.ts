import { NotificationChannel } from '@infrastructure/notification/channels/channel.interface'
import { ChannelMetadata } from '@infrastructure/notification/types/channel-metadata.type'

export type ChannelHashmap = Record<string, NotificationChannel<ChannelMetadata>>
