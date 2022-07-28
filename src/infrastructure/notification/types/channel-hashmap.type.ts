import { NotificationChannel } from '@infrastructure/notification/channels/channel.interface'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationMetadata } from '@infrastructure/notification/types/notification-metadata.type'
import { Recipient } from '@infrastructure/notification/types/recipient.type'

export type ChannelHashmap<
  M extends NotificationMetadata,
  R extends Recipient = Recipient,
  D extends NotificationData = NotificationData,
> = Record<string, NotificationChannel<M, D, R>>
