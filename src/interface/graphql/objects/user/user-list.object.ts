import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '../../interfaces/list.interface'
import { PageInfoGraphQLObject } from '../page-info.object'

import { UserRootEdgeGraphQLObject } from './user-root-edge.object'

@ObjectType('UserList', {
  implements: () => ListGraphQLInterface,
  description: 'A list containing users based on the provided filters and arguments',
})
export class UserListGraphQLObject implements ListGraphQLInterface<UserRootEdgeGraphQLObject> {
  @Field(() => [UserRootEdgeGraphQLObject], { complexity: 0 })
  public edges: UserRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
