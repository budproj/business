import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '@interface/graphql/interfaces/edge.interface'
import { UserGraphQLNode } from '@interface/graphql/nodes/user.node'

@ObjectType('UserRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our user query interface',
})
export class UserRootEdgeGraphQLObject implements EdgeGraphQLInterface<UserGraphQLNode> {
  @Field(() => UserGraphQLNode, { complexity: 1 })
  public node: UserGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
