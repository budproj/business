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
    },

    schema: {
      filePath: process.env.GRAPHQL_SCHEMA_FILE_PATH,
    },

    uploads: {
      maxFileSize: Number.parseInt(process.env.GRAPHQL_UPLOADS_MAX_BYTE_FILE_SIZE, 10),
      maxFiles: Number.parseInt(process.env.GRAPHQL_UPLOADS_MAX_NUMBER_OF_FILES, 10),
    },
  }),
)
