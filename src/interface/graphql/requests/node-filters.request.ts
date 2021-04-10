import { ArgsType, Field, ID } from '@nestjs/graphql'

import { ConnectionRelayRequest } from '@infrastructure/relay/requests/connection.request'

@ArgsType()
export class NodeFiltersRequest extends ConnectionRelayRequest {
  @Field(() => ID, {
    description: 'The ID of the node you want to filter in your query',
    nullable: true,
  })
  public id?: string
}
