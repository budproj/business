import { AppConfigInterface } from './app.interface'
import { authzConfig } from './authz/authz.config'
import { graphqlConfig } from './graphql/graphql.config'
import { loggingConfig } from './logging/logging.config'
import { serverConfig } from './server/server.config'

export const appConfig: AppConfigInterface = {
  authz: authzConfig,
  server: serverConfig,
  graphql: graphqlConfig,
  logging: loggingConfig,
}
