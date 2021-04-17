import { Field, Float, ID, InputType, Int } from '@nestjs/graphql'

@InputType('KeyResultCheckInInput', { description: 'The required data to create a new check-in' })
export class KeyResultCheckInInputObject {
  @Field(() => Float, { description: 'The check-in value you are reporting' })
  public value: number

  @Field(() => Int, { description: 'The confidence value you are reporting' })
  public confidence: number

  @Field(() => ID, { description: 'The key result ID related to this report' })
  public keyResultId: string

  @Field({ description: 'The comment in your check-in', nullable: true })
  public comment?: string
}
