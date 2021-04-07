import { QueryResultGraphQLInterface } from '@interface/graphql/interfaces/query-result.interface'

import { EdgesGraphQLInterface } from '../interfaces/edges.interface'
import { PageInfoGraphQLObject } from '../objects/page-info.object'

export class QueryResultGraphQLResponse<E extends EdgesGraphQLInterface = EdgesGraphQLInterface> {
  constructor(private readonly edges: E, private readonly pageInfo: PageInfoGraphQLObject) {}

  public marshal(): QueryResultGraphQLInterface {
    return {
      edges: this.edges,
      pageInfo: this.pageInfo,
    }
  }
}
