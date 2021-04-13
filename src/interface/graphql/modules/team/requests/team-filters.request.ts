import { ArgsType, Field, ID } from '@nestjs/graphql'

import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

import { TeamLevelGraphQLEnum } from '../enums/team-level.enum'

@ArgsType()
export class TeamFiltersRequest extends ConnectionFiltersRequest {
  @Field(() => ID, {
    description: 'The ID of the parent team that you want to user on this query',
    nullable: true,
  })
  public readonly parentId?: TeamGraphQLNode['id']

  @Field(() => TeamLevelGraphQLEnum, {
    description: 'Defines the level of the team you want to query',
    nullable: true,
  })
  public readonly level?: TeamLevelGraphQLEnum
}
