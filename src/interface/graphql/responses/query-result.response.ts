import { EntityGraphQLInterface } from '@interface/graphql/interfaces/entity.interface'
import { QueryResultGraphQLInterface } from '@interface/graphql/interfaces/query-result.interface'
import { MetadataGraphQLObject } from '@interface/graphql/objects/metadata.object'

export class QueryResultGraphQLResponse<N extends EntityGraphQLInterface = EntityGraphQLInterface> {
  constructor(private readonly nodes: N[], private readonly metadata: MetadataGraphQLObject) {}

  public marshal(): QueryResultGraphQLInterface {
    return {
      nodes: this.nodes,
      metadata: this.metadata,
    }
  }
}
