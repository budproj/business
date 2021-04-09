import { Field, InterfaceType } from '@nestjs/graphql'

import { PageInfoGraphQLObject } from '../objects/page-info.object'

import { EdgeGraphQLInterface } from './edge.interface'

@InterfaceType('List', {
  description: 'This interface wraps all lists from our schema',
})
export abstract class ListGraphQLInterface<E extends EdgeGraphQLInterface = EdgeGraphQLInterface> {
  @Field(() => PageInfoGraphQLObject, { complexity: 0 })
  public pageInfo: PageInfoGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public edges: E[]
}
