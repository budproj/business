import { Field, Float, ID, InputType, ObjectType } from '@nestjs/graphql'

import { KeyResultObject } from 'app/graphql/key-result/models'
import { UserObject } from 'app/graphql/user/models'

@ObjectType()
export class ProgressReportObject {
  @Field(() => ID)
  id: number

  @Field(() => Float, { nullable: true })
  valuePrevious?: number

  @Field(() => Float)
  valueNew: number

  @Field({ nullable: true })
  comment?: string

  @Field()
  createdAt: Date

  @Field(() => ID)
  keyResultId: KeyResultObject['id']

  @Field(() => KeyResultObject)
  keyResult: KeyResultObject

  @Field(() => ID)
  userId: UserObject['id']

  @Field(() => UserObject)
  user: UserObject
}

@InputType()
export class ProgressReportInput {
  @Field(() => Float)
  value: number

  @Field({ nullable: true })
  comment?: string

  @Field(() => ID)
  keyResultId: KeyResultObject['id']
}
