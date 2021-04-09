import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '@interface/graphql/interfaces/list.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { KeyResultRootEdgeGraphQLObject } from '../edges/key-result-root.edge'

@ObjectType('KeyResultList', {
  implements: () => ListGraphQLInterface,
  description: 'A list containing key-results based on the provided filters and arguments',
})
export class KeyResultListGraphQLObject
  implements ListGraphQLInterface<KeyResultRootEdgeGraphQLObject> {
  @Field(() => [KeyResultRootEdgeGraphQLObject], { complexity: 0 })
  public edges: KeyResultRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
