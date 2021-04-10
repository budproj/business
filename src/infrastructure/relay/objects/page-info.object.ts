import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

@ObjectType('PageInfo', {
  description: 'This object contains information regarding the pagination of a given node list',
})
export class PageInfoRelayObject {
  @Field(() => Int, {
    complexity: 0,
    description: 'Defines how many nodes we have in the give response',
  })
  public count!: number

  @Field(() => Boolean, {
    complexity: 0,
    description: 'If there is a next page, this key is set to true',
  })
  public hasNextPage!: boolean

  @Field(() => Boolean, {
    complexity: 0,
    description: 'If there is a previous page, this key is set to true',
  })
  public hasPreviousPage!: boolean

  @Field(() => String, {
    complexity: 0,
    description: 'The cursor ID of the first element in our nodes list',
  })
  public startCursor!: ConnectionCursor

  @Field(() => String, {
    complexity: 0,
    description: 'The cursor ID of the last element in our nodes list',
  })
  public endCursor!: ConnectionCursor
}
