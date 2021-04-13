import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { ObjectiveGraphQLNode } from '@interface/graphql/objects/objective/objective.node'
import { EdgeRelayInterface } from '@interface/graphql/relay/interfaces/edge.interface'

@ObjectType('UserObjectiveEdge', {
  implements: () => EdgeRelayInterface,
  description: 'This edge represents the relation between users and their objectives',
})
export class UserObjectiveEdgeGraphQLObject implements EdgeRelayInterface<ObjectiveGraphQLNode> {
  @Field(() => ObjectiveGraphQLNode, { complexity: 1 })
  public readonly node!: ObjectiveGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
