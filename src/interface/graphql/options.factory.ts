import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlOptionsFactory } from '@nestjs/graphql'

import { GraphQLConfigInterface } from '@config/graphql/graphql.interface'

@Injectable()
export class GraphQLOptionsFactory implements GqlOptionsFactory {
  constructor(private readonly graphqlConfigService: ConfigService<GraphQLConfigInterface>) {}

  public createGqlOptions() {
    const debug = this.graphqlConfigService.get('debug')
    const playground = this.graphqlConfigService.get('playground')
    const introspection = this.graphqlConfigService.get('introspection')
    const schema = this.graphqlConfigService.get('schema')

    return {
      debug: debug.enabled,
      playground: playground.enabled,
      introspection: introspection.enabled,
      autoSchemaFile: schema.filePath,
      useGlobalPrefix: true,
    }
  }
}
