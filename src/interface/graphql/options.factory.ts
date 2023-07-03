import { Injectable } from '@nestjs/common'
import { GqlOptionsFactory } from '@nestjs/graphql'

import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'

@Injectable()
export class GraphQLOptionsFactory implements GqlOptionsFactory {
  constructor(private readonly config: GraphQLConfigProvider) {}

  public createGqlOptions() {
    return {
      debug: this.config.debug.enabled,
      playground: this.config.playground.enabled,
      introspection: this.config.introspection.enabled,
      autoSchemaFile: this.config.schema.filePath,
      useGlobalPrefix: this.config.globalPrefixEnabled,
      cors: false,
    }
  }
}
