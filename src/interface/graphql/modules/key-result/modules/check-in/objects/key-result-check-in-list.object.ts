import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '@interface/graphql/interfaces/list.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { KeyResultCheckInRootEdgeGraphQLObject } from '../edges/key-result-check-in-root.edge'

@ObjectType('KeyResultCheckInList', {
  implements: () => ListGraphQLInterface,
  description: 'A list containing key-result comments based on the provided filters and arguments',
})
export class KeyResultCheckInListGraphQLObject
  implements ListGraphQLInterface<KeyResultCheckInRootEdgeGraphQLObject> {
  @Field(() => [KeyResultCheckInRootEdgeGraphQLObject], { complexity: 0 })
  public edges: KeyResultCheckInRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
