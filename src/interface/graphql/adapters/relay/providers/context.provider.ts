import { RelayGraphQLConnectionProvider } from '@interface/graphql/adapters/relay/providers/connection.provider'

export class RelayGraphQLContextProvider {
  public readonly connection = new RelayGraphQLConnectionProvider()
}
