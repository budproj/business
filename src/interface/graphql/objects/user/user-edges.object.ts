import { Field, ObjectType } from '@nestjs/graphql'

import { EdgesGraphQLInterface } from '../../interfaces/edges.interface'

import { UserNodeGraphQLObject } from './user-node.object'

@ObjectType('UserEdges', {
  implements: () => EdgesGraphQLInterface,
  description: 'The edges for our user query interface',
})
export class UserEdgesGraphQLObject implements EdgesGraphQLInterface<UserNodeGraphQLObject> {
  @Field(() => [UserNodeGraphQLObject], { complexity: 1 })
  public nodes: UserNodeGraphQLObject[]

  public cursor: string
}
