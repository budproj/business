import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '../../interfaces/list.interface'
import { PageInfoGraphQLObject } from '../page-info.object'

import { KeyResultRootEdgeGraphQLObject } from './key-result-root-edge.object'

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
