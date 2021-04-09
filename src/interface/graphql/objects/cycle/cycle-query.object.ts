import { Field, ObjectType } from '@nestjs/graphql'

import { QueryResultGraphQLInterface } from '../../interfaces/query-result.interface'
import { PageInfoGraphQLObject } from '../page-info.object'

import { CycleEdgesGraphQLObject } from './cycle-edges.object'

@ObjectType('CycleQueryResult', {
  implements: () => QueryResultGraphQLInterface,
  description: 'The query result containing cycles based on the provided filters and arguments',
})
export class CycleQueryResultGraphQLObject
  implements QueryResultGraphQLInterface<CycleEdgesGraphQLObject> {
  @Field(() => CycleEdgesGraphQLObject, { complexity: 0 })
  public edges: CycleEdgesGraphQLObject

  public pageInfo: PageInfoGraphQLObject
}
