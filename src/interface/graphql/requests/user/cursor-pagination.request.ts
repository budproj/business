import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class CursorPaginationRequest {
  @Field({
    description: 'The maximum number of items you want to return in your query',
    nullable: true,
  })
  public first?: number
}
