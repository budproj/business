import { ArgsType, Field, ID } from '@nestjs/graphql'

import { TeamLevelGraphQLEnum } from '@interface/graphql/enums/team-level.enum'
import { TeamNodeGraphQLObject } from '@interface/graphql/objects/team/team-nodes.object'
import { CursorPaginationRequest } from '@interface/graphql/requests/cursor-pagination.request'

@ArgsType()
export class TeamFiltersRequest extends CursorPaginationRequest {
  @Field(() => ID, {
    description: 'The ID of the team you want to filter in your query',
    nullable: true,
  })
  public id?: string

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
