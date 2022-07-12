import { GraphQLRequest } from '@interface/graphql/adapters/context/interfaces/request.interface'

import { Activity } from '../activities/base.activity'

export type ActivityConstructor<D, R = Record<string, any>> = new (
  data: D,
  context: Partial<GraphQLRequest>,
  request: R,
) => Activity<D>
