import { ArgsType, Field, ID } from '@nestjs/graphql'

import { ConnectionRequest } from '@infrastructure/relay/interfaces/connection-request.interface'

@ArgsType()
export class NodeFiltersRequest extends ConnectionRequest {
  @Field(() => ID, {
    description: 'The ID of the node you want to filter in your query',
    nullable: true,
  })
  public id?: string
}
