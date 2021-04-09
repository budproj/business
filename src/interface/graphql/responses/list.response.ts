import { EdgeGraphQLInterface } from '../interfaces/edge.interface'
import { ListGraphQLInterface } from '../interfaces/list.interface'

import { EdgeGraphQLResponse } from './edge.response'
import { PageInfoGraphQLResponse } from './page-info.reponse'

interface ListGraphQLResponseProperties<
  E extends EdgeGraphQLResponse,
  P extends PageInfoGraphQLResponse
> {
  edges: E[]
  pageInfo: P
}

export class ListGraphQLResponse<
  E extends EdgeGraphQLResponse = EdgeGraphQLResponse,
  P extends PageInfoGraphQLResponse = PageInfoGraphQLResponse
> {
  constructor(private readonly properties: ListGraphQLResponseProperties<E, P>) {}

  get edges(): E[] {
    return this.properties.edges
  }

  get pageInfo(): P {
    return this.properties.pageInfo
  }

  public marshal(): ListGraphQLInterface {
    return {
      edges: this.marshalEdges(),
      pageInfo: this.pageInfo.marshal(),
    }
  }

  private marshalEdges(): EdgeGraphQLInterface[] {
    return this.edges.map((edge) => edge.marshal())
  }
}
