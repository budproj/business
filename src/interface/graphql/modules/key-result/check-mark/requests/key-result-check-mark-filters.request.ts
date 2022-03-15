import { ArgsType, Field, ID } from '@nestjs/graphql'

import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class KeyResultCheckMarkFiltersRequest extends ConnectionFiltersRequest {
  @Field(() => ID, {
    description: 'Fetches key-result checklist created by a given user',
    nullable: true,
  })
  public readonly userId?: UserGraphQLNode['id']

  @Field({
    description: 'If true, show only check marks assigned to the user',
    defaultValue: false,
    nullable: true,
  })
  public readonly onlyAssignedToMe?: boolean
}
