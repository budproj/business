import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('KeyResultCheckInObject', { description: 'The required data to create a new check-in' })
export class KeyResultCheckInObject {
  @Field(() => Float, { description: 'The check-in value you are reporting' })
  public value: number

  @Field(() => Int, { description: 'The confidence value you are reporting' })
  public confidence: number

  @Field(() => ID, { description: 'The key result ID related to this report' })
  public keyResultId: string

  @Field({ description: 'The comment in your check-in', nullable: true })
  public comment?: string

  @Field({ description: 'The user id', nullable: true })
  userId?: string

  @Field({ description: 'The parent id', nullable: true })
  parentId?: string

  @Field({ description: 'The date that the check-in was created', nullable: true })
  createdAt?: string
}
