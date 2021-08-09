import { CoreEntity } from '@core/core.orm-entity'
import { GetOptions } from '@core/interfaces/get-options'
import { OrderAttribute } from '@core/types/order-attribute.type'

import { RelayGraphQLAdapter } from '../adapters/relay/relay.adapter'

export abstract class BaseGraphQLResolver {
  protected readonly relay: RelayGraphQLAdapter

  protected constructor() {
    this.relay = new RelayGraphQLAdapter()
  }

  protected marshalOrderAttributes(
    queryOptions: GetOptions<CoreEntity>,
    orderAttributeKeys: string[],
  ): OrderAttribute[] {
    const orderAttributes: OrderAttribute[] = []
    for (const key of orderAttributeKeys) {
      const orderAttribute = queryOptions.orderBy[key]
      if (orderAttribute) {
        orderAttributes.push([key, orderAttribute])
      }
    }

    return orderAttributes
  }
}
