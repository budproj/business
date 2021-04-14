import { RelayProvider } from '../relay/relay.provider'

export abstract class BaseGraphQLResolver {
  protected readonly relay: RelayProvider

  constructor() {
    this.relay = new RelayProvider()
  }
}
