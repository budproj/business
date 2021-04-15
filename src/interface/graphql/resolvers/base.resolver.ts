import { RelayGraphQLProvider } from '../relay/relay.provider'

export abstract class BaseGraphQLResolver {
  protected readonly relay: RelayGraphQLProvider

  constructor() {
    this.relay = new RelayGraphQLProvider()
  }
}
