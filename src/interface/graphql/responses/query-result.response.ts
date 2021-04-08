import { EdgesGraphQLInterface } from '@interface/graphql/interfaces/edges.interface'
import { QueryResultGraphQLInterface } from '@interface/graphql/interfaces/query-result.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

export class QueryResultGraphQLResponse<E extends EdgesGraphQLInterface = EdgesGraphQLInterface> {
  constructor(private readonly edges: E, private readonly pageInfo: PageInfoGraphQLObject) {}

  public marshal(): QueryResultGraphQLInterface {
    return {
      edges: this.edges,
      pageInfo: this.pageInfo,
    }
  }
}
