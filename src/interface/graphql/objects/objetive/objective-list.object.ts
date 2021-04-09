import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '../../interfaces/list.interface'
import { PageInfoGraphQLObject } from '../page-info.object'

import { ObjectiveRootEdgeGraphQLObject } from './objective-root-edge.object'

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
