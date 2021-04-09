import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '@interface/graphql/interfaces/list.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { ObjectiveRootEdgeGraphQLObject } from '../edges/objective-root.edge'

@ObjectType('ObjectiveList', {
  implements: () => ListGraphQLInterface,
  description: 'A list containing objectives based on the provided filters and arguments',
})
export class ObjectiveListGraphQLObject
  implements ListGraphQLInterface<ObjectiveRootEdgeGraphQLObject> {
  @Field(() => [ObjectiveRootEdgeGraphQLObject], { complexity: 0 })
  public edges: ObjectiveRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
