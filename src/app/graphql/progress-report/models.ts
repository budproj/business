import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql'

import { KeyResult } from 'app/graphql/key-result/models'
import { User } from 'app/graphql/user/models'

@ObjectType()
export class ProgressReport {
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

  @Field(() => KeyResult)
  keyResult: KeyResult

  @Field(() => User)
  user: User
}

@InputType()
export class ProgressReportInput {
  @Field(() => Float)
  value: number

  @Field({ nullable: true })
  comment?: string

  @Field(() => Int)
  keyResultId: KeyResult['id']
}
