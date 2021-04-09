import { EdgeGraphQLInterface } from '../interfaces/edge.interface'
import { NodeGraphQLInterface } from '../interfaces/node.interface'

interface EdgeGraphQLResponseProperties<N extends NodeGraphQLInterface> {
  cursor?: string
  node?: N
}

export abstract class EdgeGraphQLResponse<N extends NodeGraphQLInterface = NodeGraphQLInterface> {
  constructor(private readonly properties: EdgeGraphQLResponseProperties<N>) {
    properties.cursor = this.getCursorFromNode(properties.node)
  }

  get cursor(): string {
    return this.properties.cursor
  }

  get node(): N {
    return this.properties.node
  }

  public marshal(): EdgeGraphQLInterface<N> {
    return {
      cursor: this.cursor,
      node: this.properties.node,
    }
  }

  private getCursorFromNode(node?: NodeGraphQLInterface) {
    return node.id
  }
}
