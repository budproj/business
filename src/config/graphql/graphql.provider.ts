import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import {
  GraphQLDebugConfigInterface,
  GraphQLIntrospectionConfigInterface,
  GraphQLPlaygroundConfigInterface,
  GraphQLSchemaConfigInterface,
} from './graphql.interface'

@Injectable()
export class GraphQLConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get debug(): GraphQLDebugConfigInterface {
    return this.configService.get<GraphQLDebugConfigInterface>('graphql.debug')
  }

  get playground(): GraphQLPlaygroundConfigInterface {
    return this.configService.get<GraphQLPlaygroundConfigInterface>('graphql.playground')
  }

  get introspection(): GraphQLIntrospectionConfigInterface {
    return this.configService.get<GraphQLIntrospectionConfigInterface>('graphql.introspection')
  }

  get schema(): GraphQLSchemaConfigInterface {
    return this.configService.get<GraphQLSchemaConfigInterface>('graphql.schema')
  }
}
