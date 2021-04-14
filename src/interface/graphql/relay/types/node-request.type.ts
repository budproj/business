import { Except } from 'type-fest'

import { ConnectionRelayRequest } from '../requests/connection.request'

export type NodeRequest<A extends ConnectionRelayRequest> = Except<
  A,
  'before' | 'after' | 'first' | 'last'
>
