import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('PageInfo', {
  description: 'This object contains information regarding the pagination of a given node list',
})
export class PageInfoGraphQLObject {
  @Field(() => ID, {
    description: 'The ID of the start cursor for the given list',
  })
  public startCursor: string

  @Field(() => ID, {
    description: 'The ID of the ending cursor (the last visible) for the given list',
  })
  public endCursor: string

  @Field(() => ID, {
    description:
      'The ID of the next cursor (the first hidden) for the given list. If there are no next pages, this key will be empty',
    nullable: true,
  })
  public nextCursor?: string

  @Field(() => Boolean, {
    description: 'If there is a next page, this key is set to true',
  })
  public hasNextPage: boolean

  @Field(() => Boolean, {
    description: 'If there is a previous page, this key is set to true',
  })
  public hasPreviousPage: boolean
}
