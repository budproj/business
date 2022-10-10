import { GraphQLRequest } from '@interface/graphql/adapters/context/interfaces/request.interface'

import { Activity } from './base.activity'

export const GenericTypes = 'PENDENCIES-NOTIFICATION'

export class GenericActivity<D, R> extends Activity {
  constructor(
    public type: string,
    public readonly data: D,
    public context: Partial<GraphQLRequest>,
    public request: R,
  ) {
    super(data, context, request)
  }
}
