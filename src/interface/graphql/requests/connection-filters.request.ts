import { ArgsType, Field, ID } from '@nestjs/graphql'

import { ConnectionRelayRequest } from '../adapters/relay/requests/connection.request'
import { SortingGraphQLEnum } from '../enums/sorting.enum'
import { DefaultOrderGraphQLInput } from '../objects/default-order.object'
import { OrderGraphQLObject } from '../objects/order.object'

@ArgsType()
export class ConnectionFiltersRequest<
  O extends OrderGraphQLObject = DefaultOrderGraphQLInput,
> extends ConnectionRelayRequest {
  @Field(() => ID, {
    nullable: true,
    description: 'The ID of the node you want to filter in your query',
  })
  public readonly id?: string

  @Field(() => DefaultOrderGraphQLInput, {
    nullable: true,
    defaultValue: {
      createdAt: SortingGraphQLEnum.DESC,
    },
    description: 'Define the expected order for our connection edges',
  })
  public order?: O
}
