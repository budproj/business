import { AppConfigInterface } from './app.interface'
import { createAuthzConfig } from './authz/authz.factory'
import { createGraphQLConfig } from './graphql/graphql.factory'
import { createLoggingConfig } from './logging/logging.factory'
import { createServerConfig } from './server/server.factory'
import { createTypeORMConfig } from './typeorm/typeorm.factory'

export const appConfig: AppConfigInterface = {
  authz: createAuthzConfig(),
  server: createServerConfig(),
  graphql: createGraphQLConfig(),
  logging: createLoggingConfig(),
  typeorm: createTypeORMConfig(),
}
