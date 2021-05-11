import { NodeRelayInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'

export class RelayGraphQLConnectionProvider {
  public parentNode: NodeRelayInterface

  refreshParentNode(newNode: NodeRelayInterface): void {
    this.parentNode = newNode
  }
}
