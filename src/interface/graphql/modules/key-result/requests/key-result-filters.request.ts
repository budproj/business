import { ArgsType, Field, ID } from '@nestjs/graphql'

import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class KeyResultFiltersRequest extends ConnectionFiltersRequest {
  @Field(() => ID, {
    description: 'The user ID that should owns the key results you are trying to fetch',
    nullable: true,
  })
  public readonly ownerId?: UserGraphQLNode['id']
}
