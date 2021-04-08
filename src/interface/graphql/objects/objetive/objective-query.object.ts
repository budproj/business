import { Field, ObjectType } from '@nestjs/graphql'

import { QueryResultGraphQLInterface } from '../../interfaces/query-result.interface'
import { PageInfoGraphQLObject } from '../page-info.object'

import { ObjectiveEdgesGraphQLObject } from './objective-edges.object'

@ObjectType('ObjectiveQueryResult', {
  implements: () => QueryResultGraphQLInterface,
  description: 'The query result containing objectives based on the provided filters and arguments',
})
export class ObjectiveQueryResultGraphQLObject
  implements QueryResultGraphQLInterface<ObjectiveEdgesGraphQLObject> {
  @Field(() => ObjectiveEdgesGraphQLObject)
  public edges: ObjectiveEdgesGraphQLObject

  public pageInfo: PageInfoGraphQLObject
}
