import { NodeGraphQLInterface } from '@interface/graphql/interfaces/node.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

export class PageInfoGraphQLResponse {
  private readonly count: number

  constructor(nodes: NodeGraphQLInterface[]) {
    this.count = this.countNodes(nodes)
  }

  public marshal(): PageInfoGraphQLObject {
    return {
      count: this.count,
      hasNextPage: false,
      hasPreviousPage: false,
      // TECH DEBT: Develop the pagination logic
    }
  }

  private countNodes(nodes: NodeGraphQLInterface[]) {
    return nodes.length
  }
}
