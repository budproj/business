import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { GuardedEdgeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-edge.interface'

import { TeamGraphQLNode } from './team.node'

@ObjectType('TeamRootEdge', {
  implements: () => GuardedEdgeGraphQLInterface,
  description: 'The edge for our team query interface',
})
export class TeamRootEdgeGraphQLObject implements GuardedEdgeGraphQLInterface<TeamGraphQLNode> {
  @Field(() => TeamGraphQLNode, { complexity: 1 })
  public node!: TeamGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor!: ConnectionCursor
}
