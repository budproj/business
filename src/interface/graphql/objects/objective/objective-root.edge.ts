import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@infrastructure/relay/interfaces/edge.interface'
import { GuardedEdgeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-edge.interface'

import { ObjectiveGraphQLNode } from './objective.node'

@ObjectType('ObjectiveRootEdge', {
  implements: () => [EdgeRelayInterface, GuardedEdgeGraphQLInterface],
  description: 'The edge for our objective query interface',
})
export class ObjectiveRootEdgeGraphQLObject
  implements GuardedEdgeGraphQLInterface<ObjectiveGraphQLNode> {
  @Field(() => ObjectiveGraphQLNode, { complexity: 1 })
  public readonly node!: ObjectiveGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
