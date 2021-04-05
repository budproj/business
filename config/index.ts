import { graphqlConfig, GraphQLConfig } from './graphql'
import { loggingConfig, LoggingConfig } from './logging'
import { serverConfig, ServerConfig } from './server'

export type Config = {
  server: ServerConfig
  logging: LoggingConfig
  graphql: GraphQLConfig
}

const Config: Config = {
  server: serverConfig,
  logging: loggingConfig,
  graphql: graphqlConfig,
}

export function createConfig(): Config {
  return Config
}
