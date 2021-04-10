import { ConnectionCursor, Edge } from 'graphql-relay'

import { NodeRelayInterface } from './node.interface'

export interface EdgeRelayInterface<N extends NodeRelayInterface> extends Edge<N> {
  cursor: ConnectionCursor
  node: N
}
