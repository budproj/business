import { State } from '@adapters/state/interfaces/state.interface'

import { ActivityMetadata } from '../types/activity-metadata.type'

export abstract class Activity<D = any, C extends State = State> {
  public readonly type: string
  public readonly metadata: ActivityMetadata

  protected constructor(public data: D, public context: C) {
    this.metadata = this.marshalMetadata(context)
  }

  public attachToContext(data: Partial<C>): void {
    this.context = { ...this.context, ...data }
  }

  public refreshData(data: D): void {
    this.data = data
  }

  protected marshalMetadata(context: C): ActivityMetadata {
    return {
      userID: context.user.id,
      sessionID: context.tracing.sessionID,
      timestamp: Date.now(),
    }
  }
}
