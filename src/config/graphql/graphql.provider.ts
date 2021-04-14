import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { GodmodePropertiesInterface } from '@adapters/authorization/godmode/interfaces/godmode-properties.interface'

import {
  GraphQLDebugConfigInterface,
  GraphQLIntrospectionConfigInterface,
  GraphQLPlaygroundConfigInterface,
  GraphQLSchemaConfigInterface,
  GraphQLUploadsConfigInterface,
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

  get godmode(): GodmodePropertiesInterface {
    return this.configService.get<GodmodePropertiesInterface>('graphql.godmode')
  }

  get schema(): GraphQLSchemaConfigInterface {
    return this.configService.get<GraphQLSchemaConfigInterface>('graphql.schema')
  }

  get globalPrefixEnabled(): boolean {
    return this.configService.get<boolean>('graphql.globalPrefixEnabled')
  }

  get uploads(): GraphQLUploadsConfigInterface {
    return this.configService.get<GraphQLUploadsConfigInterface>('graphql.uploads')
  }
}
