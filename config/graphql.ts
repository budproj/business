export type GraphQLConfig = {
  debug: GraphQLDebugConfig
  playground: GraphQLPlaygroundConfig
  introspection: GraphQLInstrospectionConfig
  schema: GraphQLSchemaConfig
}

type GraphQLDebugConfig = {
  enabled: boolean
}

type GraphQLPlaygroundConfig = {
  enabled: boolean
}

type GraphQLInstrospectionConfig = {
  enabled: boolean
}

type GraphQLSchemaConfig = {
  filePath: string
}

const {
  GRAPHQL_DEBUG_ENABLED,
  GRAPHQL_PLAYGROUND_ENABLED,
  GRAPHQL_INSTROSPECTION_ENABLED,
  GRAPHQL_SCHEMA_FILE_PATH,
} = process.env

const DEFAULT_DEBUG_ENABLED = false
const DEFAULT_PLAYGROUND_ENABLED = false
const DEFAULT_INSTROSPECTION_ENABLED = false
const DEFAULT_SCHEMA_FILEPATH = './dist/src/interface/adapters/graphql/schema.gql'

export const graphqlConfig: GraphQLConfig = {
  debug: {
    enabled: GRAPHQL_DEBUG_ENABLED?.toUpperCase() === 'TRUE' ?? DEFAULT_DEBUG_ENABLED,
  },

  playground: {
    enabled: GRAPHQL_PLAYGROUND_ENABLED?.toUpperCase() === 'TRUE' ?? DEFAULT_PLAYGROUND_ENABLED,
  },

  introspection: {
    enabled:
      GRAPHQL_INSTROSPECTION_ENABLED?.toUpperCase() === 'TRUE' ?? DEFAULT_INSTROSPECTION_ENABLED,
  },

  schema: {
    filePath: GRAPHQL_SCHEMA_FILE_PATH ?? DEFAULT_SCHEMA_FILEPATH,
  },
}

export function createGraphQLConfig(): GraphQLConfig {
  return graphqlConfig
}
