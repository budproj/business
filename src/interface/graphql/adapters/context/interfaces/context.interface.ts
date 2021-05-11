import { Activity } from '@adapters/activity/activities/base.activity'
import { RelayGraphQLContextProvider } from '@interface/graphql/adapters/relay/providers/context.provider'

import { GraphQLRequest } from './request.interface'

export interface GraphQLContext {
  activity: Activity
  relay: RelayGraphQLContextProvider
  req: GraphQLRequest
}
