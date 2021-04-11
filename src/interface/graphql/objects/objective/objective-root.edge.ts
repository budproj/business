import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '../../relay/interfaces/edge.interface'

import { ObjectiveGraphQLNode } from './objective.node'

@ObjectType('ObjectiveRootEdge', {
  implements: () => EdgeRelayInterface,
  description: 'The edge for our objective query interface',
})
export class ObjectiveRootEdgeGraphQLObject implements EdgeRelayInterface<ObjectiveGraphQLNode> {
  @Field(() => ObjectiveGraphQLNode, { complexity: 1 })
  public readonly node!: ObjectiveGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
