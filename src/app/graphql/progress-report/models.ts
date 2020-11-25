import { Field, Int, ObjectType } from '@nestjs/graphql'

import { KeyResult } from 'app/graphql/key-result/models'
import { User } from 'app/graphql/user/models'

@ObjectType()
export class ProgressReport {
  @Field(() => Int)
  id: number

  @Field({ nullable: true })
  valuePrevious?: number

  @Field()
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
