import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@interface/graphql/relay/interfaces/edge.interface'

import { TeamGraphQLNode } from '../../team.node'

@ObjectType('TeamTeamEdge', {
  implements: () => EdgeRelayInterface,
  description: 'This edge represents the relation between teams and their users',
})
export class TeamTeamEdgeGraphQLObject implements EdgeRelayInterface<TeamGraphQLNode> {
  @Field(() => TeamGraphQLNode, { complexity: 1 })
  public readonly node!: TeamGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
