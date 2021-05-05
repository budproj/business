import { Connection, connectionFromArray, cursorToOffset } from 'graphql-relay'
import { omit, pick } from 'lodash'

import { CoreEntity } from '@core/core.orm-entity'
import { GetOptions } from '@core/interfaces/get-options'

import { NodeRelayInterface } from './interfaces/node.interface'
import { ConnectionRelayRequest } from './requests/connection.request'
import { NodeRequest } from './types/node-request.type'

export class RelayGraphQLAdapter {
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

  public marshalResponse<N extends NodeRelayInterface>(
    nodes: N[],
    connectionRequest: ConnectionRelayRequest,
  ): Connection<N> {
    return connectionFromArray(nodes, connectionRequest)
  }

  public marshalGetOptionsForConnection<E extends CoreEntity>(request: any): GetOptions<E> {
    return {
      limit: request.first,
      offset: this.getConnectionOffset(request),
      orderBy: request.order,
    }
  }

  private getConnectionOffset(connection: ConnectionRelayRequest): number {
    if (!connection.after) return 0

    return cursorToOffset(connection.after) + 1
  }
}