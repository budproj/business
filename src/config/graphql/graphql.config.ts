import { registerAs } from '@nestjs/config'

import { GraphQLConfigInterface } from './graphql.interface'

export const graphqlConfig = registerAs(
  'graphql',
  (): GraphQLConfigInterface => ({
    globalPrefixEnabled: process.env.GRAPHQL_GLOBAL_PREFIX_ENABLED === 'true',

    debug: {
      enabled: process.env.GRAPHQL_DEBUG_ENABLED === 'true',
    },

    playground: {
      enabled: process.env.GRAPHQL_PLAYGROUND_ENABLED === 'true',
    },

    introspection: {
      enabled: process.env.GRAPHQL_INSTROSPECTION_ENABLED === 'true',
    },

    godmode: {
      enabled: process.env.GRAPHQL_GODMODE_ENABLED === 'true',
      role: process.env.GRAPHQL_GODMODE_ROLE || 'god',
    },

    schema: {
      filePath: process.env.GRAPHQL_SCHEMA_FILE_PATH,
    },

    cors: {
      credentialsEnabled: process.env.GRAPHQL_CORS_CREDENTIALS_ENABLED === 'true',
      allowedOrigins: process.env.GRAPHQL_CORS_ALLOWED_ORIGINS?.split(','),
    },
  }),
)
