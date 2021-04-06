import { registerAs } from '@nestjs/config'

import { GraphQLConfigInterface } from './graphql.interface'

export const graphqlConfig = registerAs(
  'graphql',
  (): GraphQLConfigInterface => ({
    debug: {
      enabled: process.env.GRAPHQL_DEBUG_ENABLED === 'true',
    },

    playground: {
      enabled: process.env.GRAPHQL_PLAYGROUND_ENABLED === 'true',
    },

    introspection: {
      enabled: process.env.GRAPHQL_INSTROSPECTION_ENABLED === 'true',
    },

    schema: {
      filePath: process.env.GRAPHQL_SCHEMA_FILE_PATH,
    },
  }),
)
