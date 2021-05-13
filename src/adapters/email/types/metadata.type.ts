import { ActivityMetadata } from '@adapters/activity/types/activity-metadata.type'

export type EmailMetadata = {
  recipients: string[]
  template: string
} & ActivityMetadata
