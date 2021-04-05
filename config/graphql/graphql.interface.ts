export interface GraphQLConfigInterface {
  debug: GraphQLDebugConfigInterface
  playground: GraphQLPlaygroundConfigInterface
  introspection: GraphQLInstrospectionConfigInterface
  schema: GraphQLSchemaConfigInterface
}

interface GraphQLDebugConfigInterface {
  enabled: boolean
}

interface GraphQLPlaygroundConfigInterface {
  enabled: boolean
}

interface GraphQLInstrospectionConfigInterface {
  enabled: boolean
}

interface GraphQLSchemaConfigInterface {
  filePath: string
}
