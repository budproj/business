import { EntityGraphQLInterface } from '@interface/graphql/interfaces/entity.interface'
import { MetadataGraphQLObject } from '@interface/graphql/objects/metadata.object'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

export class MetadataGraphQLResponse {
  private readonly count: number

  constructor(nodes: EntityGraphQLInterface[], private readonly pageInfo: PageInfoGraphQLObject) {
    this.count = nodes.length
  }

  public marshal(): MetadataGraphQLObject {
    return {
      count: this.count,
      pageInfo: this.pageInfo,
    }
  }
}
