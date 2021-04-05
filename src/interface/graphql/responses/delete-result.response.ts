import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('DeleteResult', {
  description: 'The delete result from a delete mutation',
})
export abstract class DeleteResultGraphQLResponse {
  @Field(() => Int, { description: 'The amount of entities removed' })
  public affected: number
}
