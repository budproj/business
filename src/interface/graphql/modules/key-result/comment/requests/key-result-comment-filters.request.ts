import { ArgsType, Field, ID } from '@nestjs/graphql'

import { UserGraphQLNode } from '@interface/graphql/objects/user/user.node'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class KeyResultCommentFiltersRequest extends ConnectionFiltersRequest {
  @Field(() => ID, {
    description: 'Fetches key-result comments from a given user',
    nullable: true,
  })
  public readonly userId?: UserGraphQLNode['id']
}
