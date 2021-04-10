import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@infrastructure/relay/interfaces/edge.interface'

import { TeamGraphQLNode } from '../team/team.node'

@ObjectType('UserTeamEdge', {
  implements: () => EdgeRelayInterface,
  description: 'This edge represents the relation between users and their teams',
})
export class UserTeamEdgeGraphQLObject implements EdgeRelayInterface<TeamGraphQLNode> {
  @Field(() => TeamGraphQLNode, { complexity: 1 })
  public readonly node!: TeamGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}