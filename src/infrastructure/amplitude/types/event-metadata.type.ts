import { ActivityMetadata } from '@adapters/activity/types/activity-metadata.type'

export type EventMetadata = {
  activity: string
} & ActivityMetadata
