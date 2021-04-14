import { ArgsType, Field, ID } from '@nestjs/graphql'

import { ConnectionRelayRequest } from '../relay/requests/connection.request'

@ArgsType()
export class ConnectionFiltersRequest extends ConnectionRelayRequest {
  @Field(() => ID, {
    description: 'The ID of the node you want to filter in your query',
    nullable: true,
  })
  public readonly id?: string
}
