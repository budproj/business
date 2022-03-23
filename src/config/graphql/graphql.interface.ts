import { GodmodePropertiesInterface } from '@adapters/authorization/godmode/interfaces/godmode-properties.interface'

export interface GraphQLConfigInterface {
  globalPrefixEnabled: boolean
  debug: GraphQLDebugConfigInterface
  playground: GraphQLPlaygroundConfigInterface
  introspection: GraphQLIntrospectionConfigInterface
  godmode: GodmodePropertiesInterface
  schema: GraphQLSchemaConfigInterface
  cors: GraphQLCORSConfigInterface
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

export interface GraphQLCORSConfigInterface {
  credentialsEnabled: boolean
  allowedOrigins: string[]
}
