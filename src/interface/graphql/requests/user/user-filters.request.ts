import { ArgsType, Field, ID } from '@nestjs/graphql'

import { CursorPaginationRequest } from './cursor-pagination.request'

@ArgsType()
export class UserFiltersRequest extends CursorPaginationRequest {
  @Field(() => ID, {
    description: 'The ID of the user you want to filter in your query',
    nullable: true,
  })
  public id?: string
}
