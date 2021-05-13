import { RelayGraphQLAdapter } from '../adapters/relay/relay.adapter'

export abstract class BaseGraphQLResolver {
  protected readonly relay: RelayGraphQLAdapter

  protected constructor() {
    this.relay = new RelayGraphQLAdapter()
  }
}
