import { EdgesGraphQLInterface } from '@interface/graphql/interfaces/edges.interface'
import { NodeGraphQLInterface } from '@interface/graphql/interfaces/node.interface'

export class EdgesGraphQLResponse<N extends NodeGraphQLInterface = NodeGraphQLInterface> {
  private readonly cursor?: string

  constructor(private readonly nodes?: N[]) {
    this.cursor = this.getCursor(nodes)
  }

  public marshal(): EdgesGraphQLInterface<N> {
    return {
      cursor: this.cursor,
      nodes: this.nodes,
    }
  }

  private getCursor(nodes?: NodeGraphQLInterface[]) {
    return nodes.slice(-1)[0]?.id
  }
}
