import { ActivityMetadata } from '@adapters/activity/types/activity-metadata.type'

export type EventMetadata = {
  amplitudeEventType: string
} & ActivityMetadata
