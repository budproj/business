import { Field, Int, ObjectType } from '@nestjs/graphql'

import { KeyResultObject } from 'app/graphql/key-result/models'
import { UserObject } from 'app/graphql/user/models'

@ObjectType()
export class ConfidenceReportObject {
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

  @Field(() => KeyResultObject)
  keyResult: KeyResultObject

  @Field(() => UserObject)
  user: UserObject
}
