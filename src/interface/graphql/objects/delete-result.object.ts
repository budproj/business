import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('DeleteResult', {
  description: 'The delete result from a delete mutation',
})
export class DeleteResultGraphQLObject {
  @Field(() => Int, { complexity: 0, description: 'The amount of entities removed' })
  public readonly affected!: number
}
