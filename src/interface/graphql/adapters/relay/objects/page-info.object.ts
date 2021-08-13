import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

@ObjectType('PageInfo', {
  description: 'This object contains information regarding the pagination of a given node list',
})
export class PageInfoRelayObject {
  @Field(() => Boolean, {
    complexity: 0,
    description: 'If there is a next page, this key is set to true',
  })
  public readonly hasNextPage!: boolean

  @Field(() => Boolean, {
    complexity: 0,
    description: 'If there is a previous page, this key is set to true',
  })
  public readonly hasPreviousPage!: boolean

  @Field(() => String, {
    nullable: true,
    complexity: 0,
    description: 'The cursor ID of the first element in our nodes list',
  })
  public readonly startCursor!: ConnectionCursor

  @Field(() => String, {
    nullable: true,
    complexity: 0,
    description: 'The cursor ID of the last element in our nodes list',
  })
  public readonly endCursor!: ConnectionCursor
}
