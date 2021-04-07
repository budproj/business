import { Field, ObjectType } from '@nestjs/graphql'

import { EdgesGraphQLInterface } from '@interface/graphql/interfaces/edges.interface'

import { UserNodeGraphQLObject } from './user-node.object'

@ObjectType('UserEdges', {
  implements: () => EdgesGraphQLInterface,
  description: 'The edges from our user query interface',
})
export class UserEdgesGraphQLObject implements EdgesGraphQLInterface<UserNodeGraphQLObject> {
  @Field(() => [UserNodeGraphQLObject])
  public nodes: UserNodeGraphQLObject[]

  public cursor: string
}
