import { Field, ID, ObjectType } from '@nestjs/graphql'

import { KeyResultObject } from 'app/graphql/key-result/models'
import { UserObject } from 'app/graphql/user/models'

@ObjectType()
export class ConfidenceReportObject {
  @Field(() => ID)
  id: number

  @Field({ nullable: true })
  valuePrevious?: number

  @Field()
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
