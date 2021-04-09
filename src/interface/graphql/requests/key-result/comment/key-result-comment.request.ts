import { ArgsType, Field, ID } from '@nestjs/graphql'

import { UserNodeGraphQLObject } from '../../../objects/user/user-node.object'
import { NodeFiltersRequest } from '../../node-filters.request'

@ArgsType()
export class KeyResultCommentFiltersRequest extends NodeFiltersRequest {
  @Field(() => ID, {
    description: 'Fetches key-result comments from a given user',
    nullable: true,
  })
  public userId?: UserNodeGraphQLObject['id']
}
