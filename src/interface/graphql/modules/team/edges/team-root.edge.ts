import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '@interface/graphql/interfaces/edge.interface'
import { TeamGraphQLNode } from '@interface/graphql/nodes/team.node'

@ObjectType('TeamRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our team query interface',
})
export class TeamRootEdgeGraphQLObject implements EdgeGraphQLInterface<TeamGraphQLNode> {
  @Field(() => TeamGraphQLNode, { complexity: 1 })
  public node: TeamGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
