import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'

@ObjectType('ObjectiveTeamEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'This edge represents the relation between objectives and their support teams',
})
export class ObjectiveTeamEdgeGraphQLObject implements EdgeRelayGraphQLInterface<TeamGraphQLNode> {
  @Field(() => TeamGraphQLNode, { complexity: 1 })
  public readonly node!: TeamGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
