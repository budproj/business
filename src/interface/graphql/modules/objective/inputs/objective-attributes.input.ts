import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('ObjectiveAttributesInput', {
  description: 'Data that you can assign to a given objective',
})
export class ObjectiveAttributesInput {
  @Field({ description: 'The title of the objective', nullable: true })
  public readonly title?: string

  @Field({ description: 'The description of the objective', nullable: true })
  public readonly description?: string

  @Field(() => ID, { description: 'The ID of the cycle for that objective', nullable: true })
  public readonly cycleId?: string

  @Field(() => ID, { description: 'The ID of the owner for the cycle', nullable: true })
  public readonly ownerId?: string

  @Field(() => ID, { description: 'The main team of that objective', nullable: true })
  public readonly teamId?: string
}
