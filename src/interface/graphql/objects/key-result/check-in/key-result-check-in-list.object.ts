import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '../../../interfaces/list.interface'
import { PageInfoGraphQLObject } from '../../page-info.object'

import { KeyResultCheckInRootEdgeGraphQLObject } from './key-result-check-in-root-edge.object'

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
