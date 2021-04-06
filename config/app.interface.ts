import { AuthzConfigInterface } from './authz/authz.interface'
import { GraphQLConfigInterface } from './graphql/graphql.interface'
import { LoggingConfigInterface } from './logging/logging.interface'
import { ServerConfigInterface } from './server/server.interface'
import { TypeORMConfigInterface } from './typeorm/typeorm.interface'

export interface AppConfigInterface {
  authz: AuthzConfigInterface
  server: ServerConfigInterface
  logging: LoggingConfigInterface
  graphql: GraphQLConfigInterface
  typeorm: TypeORMConfigInterface
}
