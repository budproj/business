import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType('Delta', {
  description:
    "The delta of an entity. In this key you're going to find the difference bet this entity and a given previous snapshot of it",
})
export class DeltaGraphQLObject {
  @Field(() => Float, {
    complexity: 0,
    description: 'The progress difference of this entity comparing with it last week',
  })
  public readonly progress!: number
}
