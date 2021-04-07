import { Field, InterfaceType } from '@nestjs/graphql'

import { MetadataGraphQLObject } from '@interface/graphql/objects/metadata.object'

import { EntityGraphQLInterface } from './entity.interface'

@InterfaceType('QueryResult', {
  description: 'This interface wraps all query results from our schema',
})
export abstract class QueryResultGraphQLInterface<N extends EntityGraphQLInterface = any> {
  @Field(() => MetadataGraphQLObject)
  public metadata: MetadataGraphQLObject

  public nodes: N[]
}
