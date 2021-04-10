import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionGraphQLInterface } from '@interface/graphql/interfaces/connection.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { ObjectiveRootEdgeGraphQLObject } from '../edges/objective-root.edge'

@ObjectType('ObjectiveList', {
  implements: () => ConnectionGraphQLInterface,
  description: 'A list containing objectives based on the provided filters and arguments',
})
export class ObjectiveListGraphQLObject
  implements ConnectionGraphQLInterface<ObjectiveRootEdgeGraphQLObject> {
  @Field(() => [ObjectiveRootEdgeGraphQLObject], { complexity: 0 })
  public edges: ObjectiveRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
