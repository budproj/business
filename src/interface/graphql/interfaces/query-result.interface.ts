import { Field, InterfaceType } from '@nestjs/graphql'

import { MetadataGraphQLObject } from '@interface/graphql/objects/metadata.object'

import { NodeGraphQLInterface } from './node.interface'

@InterfaceType('QueryResult', {
  description: 'This interface wraps all query results from our schema',
})
export abstract class QueryResultGraphQLInterface<N extends NodeGraphQLInterface = any> {
  @Field(() => MetadataGraphQLObject)
  public metadata: MetadataGraphQLObject

  public nodes: N[]
}
