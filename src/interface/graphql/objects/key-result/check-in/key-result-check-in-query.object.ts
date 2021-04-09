import { Field, ObjectType } from '@nestjs/graphql'

import { QueryResultGraphQLInterface } from '../../../interfaces/query-result.interface'
import { PageInfoGraphQLObject } from '../../page-info.object'

import { KeyResultCheckInEdgesGraphQLObject } from './key-result-check-in-edges.object'

@ObjectType('KeyResultCheckInQueryResult', {
  implements: () => QueryResultGraphQLInterface,
  description:
    'The query result containing key-result comments based on the provided filters and arguments',
})
export class KeyResultCheckInQueryResultGraphQLObject
  implements QueryResultGraphQLInterface<KeyResultCheckInEdgesGraphQLObject> {
  @Field(() => KeyResultCheckInEdgesGraphQLObject, { complexity: 0 })
  public edges: KeyResultCheckInEdgesGraphQLObject

  public pageInfo: PageInfoGraphQLObject
}
