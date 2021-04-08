import { ArgsType, Field, ID } from '@nestjs/graphql'

import { UserNodeGraphQLObject } from '../../objects/user/user-node.object'
import { NodeFiltersRequest } from '../node-filters.request'

@ArgsType()
export class KeyResultFiltersRequest extends NodeFiltersRequest {
  @Field(() => ID, {
    description: 'The user ID that should owns the key results you are trying to fetch',
    nullable: true,
  })
  public ownerId?: UserNodeGraphQLObject['id']
}
