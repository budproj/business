import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('ObjectiveInput', {
  description: 'The required data to create a new objective',
})
export class ObjectiveInput {
  @Field({ description: 'The title of the objective' })
  public readonly title: string

  @Field({ description: 'The description of the objective', nullable: true })
  public readonly description?: string

  @Field(() => ID, { description: 'The ID of the cycle for that objective' })
  public readonly cycleId: string

  @Field(() => ID, { description: 'The ID of the owner for the cycle' })
  public readonly ownerId: string

  @Field(() => ID, { description: 'The main team of that objective', nullable: true })
  public readonly teamId?: string
}
