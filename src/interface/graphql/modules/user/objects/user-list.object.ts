import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionGraphQLInterface } from '@interface/graphql/interfaces/connection.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { UserRootEdgeGraphQLObject } from '../edges/user-root.edge'

@ObjectType('UserList', {
  implements: () => ConnectionGraphQLInterface,
  description: 'A list containing users based on the provided filters and arguments',
})
export class UserListGraphQLObject
  implements ConnectionGraphQLInterface<UserRootEdgeGraphQLObject> {
  @Field(() => [UserRootEdgeGraphQLObject], { complexity: 0 })
  public edges: UserRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
