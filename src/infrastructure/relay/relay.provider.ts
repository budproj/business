import { Connection, connectionFromArray } from 'graphql-relay'
import { omit, pick } from 'lodash'

import { NodeRelayInterface } from './interfaces/node.interface'
import { ConnectionRelayRequest } from './requests/connection.request'
import { NodeRequest } from './types/node-request.type'

export class RelayProvider {
  public getNodeRequest<R extends ConnectionRelayRequest>(request: R): NodeRequest<R> {
    return omit(request, ['before', 'after', 'first', 'last'])
  }

  public getConnectionRelayRequest<R extends ConnectionRelayRequest>(
    request: R,
  ): ConnectionRelayRequest {
    return pick(request, ['before', 'after', 'first', 'last'])
  }

  public unmarshalRequest<R extends ConnectionRelayRequest>(
    request: R,
  ): [ConnectionRelayRequest, NodeRequest<R>] {
    return [this.getConnectionRelayRequest(request), this.getNodeRequest(request)]
  }

  public marshalResponse<N extends NodeRelayInterface>(
    nodes: N[],
    connectionRequest: ConnectionRelayRequest,
  ): Connection<N> {
    return connectionFromArray(nodes, connectionRequest)
  }
}