import { ArgsType, Field, ID } from '@nestjs/graphql'

import { UserGraphQLNode } from '@interface/graphql/objects/user/user.node'
import { NodeFiltersRequest } from '@interface/graphql/requests/node-filters.request'

@ArgsType()
export class KeyResultCommentFiltersRequest extends NodeFiltersRequest {
  @Field(() => ID, {
    description: 'Fetches key-result comments from a given user',
    nullable: true,
  })
  public userId?: UserGraphQLNode['id']
}
