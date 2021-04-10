import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@infrastructure/relay/interfaces/edge.interface'
import { GuardedEdgeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-edge.interface'

import { TeamGraphQLNode } from './team.node'

@ObjectType('TeamRootEdge', {
  implements: () => [EdgeRelayInterface, GuardedEdgeGraphQLInterface],
  description: 'The edge for our team query interface',
})
export class TeamRootEdgeGraphQLObject implements GuardedEdgeGraphQLInterface<TeamGraphQLNode> {
  @Field(() => TeamGraphQLNode, { complexity: 1 })
  public readonly node!: TeamGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
