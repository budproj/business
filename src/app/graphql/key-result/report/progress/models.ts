import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql'

import { KeyResultObject } from 'app/graphql/key-result/models'
import { UserObject } from 'app/graphql/user/models'

@ObjectType()
export class ProgressReportObject {
  @Field(() => Int)
  id: number

  @Field(() => Float, { nullable: true })
  valuePrevious?: number

  @Field(() => Float)
  valueNew: number

  @Field({ nullable: true })
  comment?: string

  @Field()
  createdAt: Date

  @Field(() => KeyResultObject)
  keyResult: KeyResultObject

  @Field(() => UserObject)
  user: UserObject
}

@InputType()
export class ProgressReportInput {
  @Field(() => Float)
  value: number

  @Field({ nullable: true })
  comment?: string

  @Field(() => Int)
  keyResultId: KeyResultObject['id']
}
