import { ArgsType, Field, ID } from '@nestjs/graphql'

import { TeamGraphQLNode } from '@interface/graphql/nodes/team.node'
import { NodeFiltersRequest } from '@interface/graphql/requests/node-filters.request'

import { TeamLevelGraphQLEnum } from '../enums/team-level.enum'

@ArgsType()
export class TeamFiltersRequest extends NodeFiltersRequest {
  @Field(() => ID, {
    description: 'The ID of the parent team that you want to user on this query',
    nullable: true,
  })
  public parentId?: TeamGraphQLNode['id']

  @Field(() => TeamLevelGraphQLEnum, {
    description: 'Defines the level of the team you want to query',
    nullable: true,
  })
  public level?: TeamLevelGraphQLEnum
}
