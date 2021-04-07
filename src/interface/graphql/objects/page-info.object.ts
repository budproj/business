import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('PageInfo', {
  description: 'This object contains information regarding the pagination of a given node list',
})
export class PageInfoGraphQLObject {
  @Field(() => Int, {
    description: 'Defines how many nodes we have in the give response',
  })
  public count: number

  @Field(() => Boolean, {
    description: 'If there is a next page, this key is set to true',
  })
  public hasNextPage: boolean

  @Field(() => Boolean, {
    description: 'If there is a previous page, this key is set to true',
  })
  public hasPreviousPage: boolean
}
