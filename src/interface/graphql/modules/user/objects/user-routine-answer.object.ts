import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UserRoutineAnswerObject', {
  description: 'An object continaing the amplitude data from the user',
})
export class UserRoutineAnswerObject {
  @Field({
    nullable: true,
  })
  id: string

  @Field({
    nullable: true,
  })
  questionId: string

  @Field({
    nullable: true,
  })
  answerGroupId: string

  @Field({
    nullable: true,
  })
  value: string
}
