import { ActivityMetadata } from '../types/activity-metadata.type'

export interface Activity {
  metadata: ActivityMetadata
  data: Record<string, any>
}
