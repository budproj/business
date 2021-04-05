import { graphqlConfig, GraphQLConfig } from './graphql'

export type Config = {
  graphql: GraphQLConfig
}

const config: Config = {
  graphql: graphqlConfig,
}

export function createConfig(): Config {
  return config
}