import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { ObjectiveGraphQLNode } from '@interface/graphql/modules/objective/objective.node'
import { EdgeRelayInterface } from '@interface/graphql/relay/interfaces/edge.interface'

@ObjectType('CycleObjectiveEdge', {
  implements: () => EdgeRelayInterface,
  description: 'This edge represents the relation between cycles and their objectives',
})
export class CycleObjectiveEdgeGraphQLObject implements EdgeRelayInterface<ObjectiveGraphQLNode> {
  @Field(() => ObjectiveGraphQLNode, { complexity: 1 })
  public readonly node!: ObjectiveGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}