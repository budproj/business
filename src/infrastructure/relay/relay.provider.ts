import { omit, pick } from 'lodash'

import { ConnectionRequest } from './interfaces/connection-request.interface'
import { NodeRequest } from './types/node-request.type'

export class RelayProvider {
  public getNodeRequest<R extends ConnectionRequest>(request: R): NodeRequest<R> {
    return omit(request, ['before', 'after', 'first', 'last'])
  }

  public getConnectionRequest<R extends ConnectionRequest>(request: R): ConnectionRequest {
    return pick(request, ['before', 'after', 'first', 'last'])
  }

  public unmarshalRequest<R extends ConnectionRequest>(
    request: R,
  ): [ConnectionRequest, NodeRequest<R>] {
    return [this.getConnectionRequest(request), this.getNodeRequest(request)]
  }
}
