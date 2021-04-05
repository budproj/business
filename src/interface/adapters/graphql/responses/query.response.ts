import { Field, InterfaceType } from '@nestjs/graphql'

import { EntityGraphQLObject } from '@interface/adapters/graphql/objects/entity.object'
import { MetadataGraphQLObject } from '@interface/adapters/graphql/objects/metadata.object'

@InterfaceType()
export abstract class QueryGraphQLResponse<N extends EntityGraphQLObject = any> {
  @Field(() => MetadataGraphQLObject)
  public metadata: MetadataGraphQLObject

  public nodes: N[]
}
