import { Activity } from '@adapters/activity/activities/base.activity'

import { GraphQLRequest } from './request.interface'

export interface GraphQLContext {
  activity: Activity
  req: GraphQLRequest
}
