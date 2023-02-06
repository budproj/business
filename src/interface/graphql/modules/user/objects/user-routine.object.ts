import { Field, ObjectType } from '@nestjs/graphql'

import { UserRoutineAnswerObject } from './user-routine-answer.object'

@ObjectType('UserRoutineObject', {
  description: 'An object continaing the amplitude data from the user',
})
export class UserRoutineObject {
  @Field({
    nullable: true,
  })
  public readonly id: string

  @Field({
    nullable: true,
  })
  @Field({
    nullable: true,
  })
  public readonly companyId: string

  @Field({
    nullable: true,
  })
  public readonly userId: string

  @Field({
    nullable: true,
  })
  public readonly timestamp: Date

  @Field(() => UserRoutineAnswerObject, {
    nullable: true,
  })
  public readonly answers: UserRoutineAnswerObject[]
}
