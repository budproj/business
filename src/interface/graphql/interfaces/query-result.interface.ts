import { Field, InterfaceType } from '@nestjs/graphql'

import { PageInfoGraphQLObject } from '../objects/page-info.object'

import { EdgesGraphQLInterface } from './edges.interface'

@InterfaceType('QueryResult', {
  description: 'This interface wraps all query results from our schema',
})
export abstract class QueryResultGraphQLInterface<
  E extends EdgesGraphQLInterface = EdgesGraphQLInterface
> {
  @Field(() => PageInfoGraphQLObject, { complexity: 0 })
  public pageInfo: PageInfoGraphQLObject

  public edges: E
}
