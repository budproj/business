import { Field, InterfaceType } from '@nestjs/graphql'

import { EntityGraphQLObject } from '@interface/graphql/objects/entity.object'
import { MetadataGraphQLObject } from '@interface/graphql/objects/metadata.object'

@InterfaceType('QueryResponse', {
  description: 'This interface wraps all query results from our schema',
})
export abstract class QueryGraphQLResponse<N extends EntityGraphQLObject = any> {
  @Field(() => MetadataGraphQLObject)
  public metadata: MetadataGraphQLObject

  public nodes: N[]
}
