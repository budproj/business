import { GodmodePropertiesInterface } from '@adapters/authorization/godmode/interfaces/godmode-properties.interface'

export interface GraphQLConfigInterface {
  debug: GraphQLDebugConfigInterface
  playground: GraphQLPlaygroundConfigInterface
  introspection: GraphQLIntrospectionConfigInterface
  godmode: GodmodePropertiesInterface
  schema: GraphQLSchemaConfigInterface
}

export interface GraphQLDebugConfigInterface {
  enabled: boolean
}

export interface GraphQLPlaygroundConfigInterface {
  enabled: boolean
}

export interface GraphQLIntrospectionConfigInterface {
  enabled: boolean
}

export interface GraphQLSchemaConfigInterface {
  filePath: string
}
