import { ActivityMetadata } from '@adapters/activity/types/activity-metadata.type'

export type NotificationMetadata = {
  notificationType: string
} & ActivityMetadata
