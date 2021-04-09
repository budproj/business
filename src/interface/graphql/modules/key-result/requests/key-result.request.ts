import { ArgsType, Field, ID } from '@nestjs/graphql'

import { UserGraphQLNode } from '@interface/graphql/nodes/user.node'
import { NodeFiltersRequest } from '@interface/graphql/requests/node-filters.request'

@ArgsType()
export class KeyResultFiltersRequest extends NodeFiltersRequest {
  @Field(() => ID, {
    description: 'The user ID that should owns the key results you are trying to fetch',
    nullable: true,
  })
  public ownerId?: UserGraphQLNode['id']
}
