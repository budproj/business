import { NodeGraphQLInterface } from '@interface/graphql/interfaces/node.interface'
import { QueryResultGraphQLInterface } from '@interface/graphql/interfaces/query-result.interface'
import { MetadataGraphQLObject } from '@interface/graphql/objects/metadata.object'

export class QueryResultGraphQLResponse<N extends NodeGraphQLInterface = NodeGraphQLInterface> {
  constructor(private readonly nodes: N[], private readonly metadata: MetadataGraphQLObject) {}

  public marshal(): QueryResultGraphQLInterface {
    return {
      nodes: this.nodes,
      metadata: this.metadata,
    }
  }
}
