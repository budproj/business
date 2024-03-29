import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'
import { ObjectiveGraphQLNode } from '@interface/graphql/modules/objective/objective.node'

@ObjectType('TeamObjectiveEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'This edge represents the relation between teams and their objectives',
})
export class TeamObjectiveEdgeGraphQLObject
  implements EdgeRelayGraphQLInterface<ObjectiveGraphQLNode>
{
  @Field(() => ObjectiveGraphQLNode, { complexity: 1 })
  public readonly node!: ObjectiveGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
