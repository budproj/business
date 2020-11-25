import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Company } from 'app/graphql/company/models'
import { KeyResult } from 'app/graphql/key-result/models'
import { User } from 'app/graphql/user/models'

@ObjectType()
export class Team {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [KeyResult])
  keyResults: KeyResult[]

  @Field(() => Company)
  company: Company

  @Field(() => [User])
  users: Promise<User[]>
}
