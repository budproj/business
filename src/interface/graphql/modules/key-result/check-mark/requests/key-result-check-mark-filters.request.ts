import { ArgsType, Field, ID } from '@nestjs/graphql'

import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class KeyResultCheckMarkFiltersRequest extends ConnectionFiltersRequest {
  @Field(() => ID, {
    description: 'Fetches key-result checklist from a given user',
    nullable: true,
  })
  public readonly userId?: UserGraphQLNode['id']
}
