import { ArgsType, Field, ID } from '@nestjs/graphql'

import { SortingGraphQLEnum } from '../enums/sorting.enum'
import { OrderNodeGraphQLInput } from '../objects/order-node.object'
import { ConnectionRelayRequest } from '../relay/requests/connection.request'

@ArgsType()
export class ConnectionFiltersRequest extends ConnectionRelayRequest {
  @Field(() => ID, {
    nullable: true,
    description: 'The ID of the node you want to filter in your query',
  })
  public readonly id?: string

  @Field(() => OrderNodeGraphQLInput, {
    nullable: true,
    defaultValue: {
      createdAt: SortingGraphQLEnum.DESC,
    },
    description: 'Define the expected order for our connection edges',
  })
  public order?: OrderNodeGraphQLInput
}
