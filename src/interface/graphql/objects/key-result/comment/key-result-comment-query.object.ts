import { Field, ObjectType } from '@nestjs/graphql'

import { QueryResultGraphQLInterface } from '../../../interfaces/query-result.interface'
import { PageInfoGraphQLObject } from '../../page-info.object'

import { KeyResultCommentEdgesGraphQLObject } from './key-result-comment-edges.object'

@ObjectType('KeyResultCommentQueryResult', {
  implements: () => QueryResultGraphQLInterface,
  description:
    'The query result containing key-result comments based on the provided filters and arguments',
})
export class KeyResultCommentQueryResultGraphQLObject
  implements QueryResultGraphQLInterface<KeyResultCommentEdgesGraphQLObject> {
  @Field(() => KeyResultCommentEdgesGraphQLObject)
  public edges: KeyResultCommentEdgesGraphQLObject

  public pageInfo: PageInfoGraphQLObject
}
