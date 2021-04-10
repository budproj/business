import { Except } from 'type-fest'

import { ConnectionRequest } from '../interfaces/connection-request.interface'

export type NodeRequest<A extends ConnectionRequest> = Except<
  A,
  'before' | 'after' | 'first' | 'last'
>
