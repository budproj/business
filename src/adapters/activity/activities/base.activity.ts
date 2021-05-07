import { Context } from '@adapters/context/interfaces/context.interface'

import { ActivityMetadata } from '../types/activity-metadata.type'

export abstract class Activity<D = any> {
  public readonly type: string
  public readonly metadata: ActivityMetadata

  constructor(public readonly data: D, public readonly context: Context) {
    this.metadata = this.marshalMetadata(context)
  }

  protected marshalMetadata(context: Context): ActivityMetadata {
    return {
      userID: context.user.id,
      sessionID: context.tracing.sessionID,
      timestamp: Date.now(),
    }
  }
}
