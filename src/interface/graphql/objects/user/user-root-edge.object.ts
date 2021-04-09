import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '../../interfaces/edge.interface'

import { UserNodeGraphQLObject } from './user-node.object'

@ObjectType('UserRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our user query interface',
})
export class UserRootEdgeGraphQLObject implements EdgeGraphQLInterface<UserNodeGraphQLObject> {
  @Field(() => UserNodeGraphQLObject, { complexity: 1 })
  public node: UserNodeGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
