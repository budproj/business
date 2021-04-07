import { ArgsType, Field, ID } from '@nestjs/graphql'

import { CursorPaginationRequest } from '@interface/graphql/requests/cursor-pagination.request'

@ArgsType()
export class TeamFiltersRequest extends CursorPaginationRequest {
  @Field(() => ID, {
    description: 'The ID of the team you want to filter in your query',
    nullable: true,
  })
  public id?: string
}
