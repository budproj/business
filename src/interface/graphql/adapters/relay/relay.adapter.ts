import { connectionFromArray } from 'graphql-relay'
import { omit, pick } from 'lodash'

import { CoreEntity } from '@core/core.orm-entity'
import { GetOptions } from '@core/interfaces/get-options'
import { Connection } from '@interface/graphql/adapters/relay/interfaces/connection.interface'

import { NodeRelayGraphQLInterface } from './interfaces/node.interface'
import { ConnectionRelayRequest } from './requests/connection.request'
import { NodeRequest } from './types/node-request.type'

export class RelayGraphQLAdapter {
  static getConnectionOffset(connection: ConnectionRelayRequest): number {
    if (!connection.after) return 0

    return connection.after
  }

  public getNodeRequest<R extends ConnectionRelayRequest>(request: R): NodeRequest<R> {
    return omit(request, ['before', 'after', 'first', 'last', 'order']) as any
  }

  public getConnectionRelayRequest<R extends ConnectionRelayRequest>(
    request: R,
  ): ConnectionRelayRequest {
    return pick(request, ['before', 'after', 'first', 'last'])
  }

  public unmarshalRequest<R extends ConnectionRelayRequest, E extends CoreEntity>(
    request: R,
  ): [NodeRequest<R>, GetOptions<E>, ConnectionRelayRequest] {
    const connection = this.getConnectionRelayRequest(request)
    const getOptions = this.marshalGetOptionsForConnection<E>(request)
    const nodeRequest = this.getNodeRequest(request)

    return [nodeRequest, getOptions, connection]
  }

  public marshalResponse<N extends NodeRelayGraphQLInterface>(
    nodes: N[],
    connectionRequest: ConnectionRelayRequest,
    parentNode?: NodeRelayGraphQLInterface,
  ): Connection<N> {
    const connection = connectionFromArray(nodes, {})

    return {
      ...connection,
      parentNodeId: parentNode?.id,
    }
  }

  public marshalGetOptionsForConnection<E extends CoreEntity>(request: any): GetOptions<E> {
    return {
      limit: request.first,
      offset: RelayGraphQLAdapter.getConnectionOffset(request),
      orderBy: request.order,
    }
  }
}
