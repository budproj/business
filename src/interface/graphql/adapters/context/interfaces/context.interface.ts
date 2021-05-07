import { Activity } from '@adapters/activity/activities/base.activity'

import { GraphQLRequest } from './request.interface'

export interface GraphQContext {
  activity: Activity
  req: GraphQLRequest
}
