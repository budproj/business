import { EdgesGraphQLInterface } from '../interfaces/edges.interface'
import { QueryResultGraphQLInterface } from '../interfaces/query-result.interface'
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
