import { ArgsType, Field, ID } from '@nestjs/graphql'

import { CursorPaginationRequest } from './cursor-pagination.request'

@ArgsType()
export class NodeFiltersRequest extends CursorPaginationRequest {
  @Field(() => ID, {
    description: 'The ID of the node you want to filter in your query',
    nullable: true,
  })
  public id?: string
}
