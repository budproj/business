import { ArgsType, Field, ID } from '@nestjs/graphql'

import { TeamLevelGraphQLEnum } from '../../enums/team-level.enum'
import { TeamNodeGraphQLObject } from '../../objects/team/team-node.object'
import { NodeFiltersRequest } from '../node-filters.request'

@ArgsType()
export class TeamFiltersRequest extends NodeFiltersRequest {
  @Field(() => ID, {
    description: 'The ID of the parent team that you want to user on this query',
    nullable: true,
  })
  public parentId?: TeamNodeGraphQLObject['id']

  @Field(() => TeamLevelGraphQLEnum, {
    description: 'Defines the level of the team you want to query',
    nullable: true,
  })
  public level?: TeamLevelGraphQLEnum
}
