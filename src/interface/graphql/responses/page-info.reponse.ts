import { PageInfoGraphQLObject } from '../objects/page-info.object'

import { EdgeGraphQLResponse } from './edge.response'

interface PageInfoGraphQLResponseProperties<E extends EdgeGraphQLResponse> {
  edges: E[]
  count?: number
  startCursor?: string
  endCursor?: string
}
export class PageInfoGraphQLResponse<E extends EdgeGraphQLResponse = EdgeGraphQLResponse> {
  constructor(private readonly properties: PageInfoGraphQLResponseProperties<E>) {
    properties.count = this.getCountFromEdges(properties.edges)
    properties.startCursor = this.getStartCursorFromEdges(properties.edges)
    properties.endCursor = this.getEndCursorFromEdges(properties.edges)
  }

  get edges(): E[] {
    return this.properties.edges
  }

  get count(): number | undefined {
    return this.properties.count
  }

  get startCursor(): string | undefined {
    return this.properties.startCursor
  }

  get endCursor(): string | undefined {
    return this.properties.endCursor
  }

  get hasNextPage(): boolean {
    return false
  }

  get hasPreviousPage(): boolean {
    return false
  }

  public marshal(): PageInfoGraphQLObject {
    return {
      count: this.count,
      startCursor: this.startCursor,
      endCursor: this.endCursor,
      hasNextPage: this.hasNextPage,
      hasPreviousPage: this.hasPreviousPage,
    }
  }

  private getCountFromEdges(edges: E[]): number {
    return edges.length
  }

  private getStartCursorFromEdges(edges: E[]): string {
    return edges[0]?.cursor
  }

  private getEndCursorFromEdges(edges: E[]): string {
    return edges?.slice(-1)[0]?.cursor
  }
}
