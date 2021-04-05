import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlOptionsFactory } from '@nestjs/graphql'

import { GraphQLConfig } from '@config/graphql'

@Injectable()
export class GraphQLAdapterFactory implements GqlOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createGqlOptions() {
    const config = this.configService.get<GraphQLConfig>('graphql')

    return {
      debug: config?.debug.enabled,
      playground: config?.playground.enabled,
      introspection: config?.introspection.enabled,
      autoSchemaFile: config?.schema.filePath,
      useGlobalPrefix: true,
    }
  }
}
