import { GraphQLRequest } from '@interface/graphql/adapters/context/interfaces/request.interface'

import { ActivityMetadata } from '../types/activity-metadata.type'

export abstract class Activity<
  D = any,
  C extends Partial<GraphQLRequest> = Partial<GraphQLRequest>,
  R = Record<string, any>,
> {
  public readonly type: string
  public readonly metadata: ActivityMetadata

  protected constructor(public data: D, public context: C, public request?: R) {
    this.metadata = this.marshalMetadata({
      ...context,
      ...request,
    })
  }

  public attachToContext(data: Partial<C>): void {
    this.context = { ...this.context, ...data }
  }

  public refreshData(data: D): void {
    this.data = data
  }

  protected marshalMetadata(context: C): ActivityMetadata {
    return {
      userID: context.userWithContext.id,
      sessionID: context.tracing.sessionID,
      timestamp: Date.now(),
    }
  }
}
