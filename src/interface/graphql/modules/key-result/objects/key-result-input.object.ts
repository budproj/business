import { Field, Float, ID, InputType } from '@nestjs/graphql'

@InputType('KeyResultInput', { description: 'Data that you can assign to a given key-result' })
export class KeyResultInputObject {
  @Field({ description: 'The title of the key result', nullable: true })
  public readonly title?: string

  @Field(() => Float, { description: 'The initial value of the key result', nullable: true })
  public readonly initialValue?: number

  @Field(() => Float, { description: 'The goal of the key result', nullable: true })
  public readonly goal?: number

  @Field(() => ID, { description: 'The owner ID of the key result', nullable: true })
  public readonly ownerId?: string

  @Field(() => ID, { description: 'The object ID that this key result belongs to', nullable: true })
  public readonly objectiveId?: string

  @Field(() => ID, { description: 'The team ID that this key result belongs to', nullable: true })
  public readonly teamId?: string

  @Field({
    description: 'The description explaining the key result',
    nullable: true,
  })
  public readonly description?: string
}
