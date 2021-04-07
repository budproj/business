import { NodeGraphQLInterface } from '@interface/graphql/interfaces/node.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

export class PageInfoGraphQLResponse {
  private readonly startCursor: string
  private readonly endCursor: string

  constructor(nodes: NodeGraphQLInterface[]) {
    this.startCursor = this.getStartCursor(nodes)
    this.endCursor = this.getEndCursor(nodes)
  }

  public marshal(): PageInfoGraphQLObject {
    return {
      startCursor: this.startCursor,
      endCursor: this.endCursor,
      hasNextPage: false,
      hasPreviousPage: false,
      // TECH DEBT: Develop the pagination logic
    }
  }

  private getStartCursor(nodes: NodeGraphQLInterface[]) {
    return nodes[0].id
  }

  private getEndCursor(nodes: NodeGraphQLInterface[]) {
    return nodes.slice(-1)[0].id
  }
}
