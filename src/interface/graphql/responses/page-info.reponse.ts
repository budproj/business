import { EntityGraphQLInterface } from '@interface/graphql/interfaces/entity.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

export class PageInfoGraphQLResponse {
  private readonly startCursor: string
  private readonly endCursor: string

  constructor(nodes: EntityGraphQLInterface[]) {
    this.startCursor = this.getStartCursor(nodes)
    this.endCursor = this.getEndCursor(nodes)
  }

  public marshal(): PageInfoGraphQLObject {
    return {
      startCursor: this.startCursor,
      endCursor: this.endCursor,
    } as any
  }

  private getStartCursor(nodes: EntityGraphQLInterface[]) {
    return nodes[0].id
  }

  private getEndCursor(nodes: EntityGraphQLInterface[]) {
    return nodes.slice(-1)[0].id
  }
}
