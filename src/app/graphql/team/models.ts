import { Field, Int, ObjectType } from '@nestjs/graphql'

import { CompanyObject } from 'app/graphql/company/models'
import { KeyResultObject } from 'app/graphql/key-result/models'
import { UserObject } from 'app/graphql/user/models'

@ObjectType()
export class TeamObject {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [KeyResultObject])
  keyResults: KeyResultObject[]

  @Field(() => CompanyObject)
  company: CompanyObject

  @Field(() => [UserObject])
  users: Promise<UserObject[]>
}
