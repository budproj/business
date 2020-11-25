import { Field, Int, ObjectType } from '@nestjs/graphql'

import { KeyResult } from 'app/graphql/key-result/models'
import { User } from 'app/graphql/user/models'
import { KeyResultViewBinding } from 'domain/key-result-view/dto'

@ObjectType()
export class KeyResultView {
  @Field(() => Int)
  id: number

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  binding?: KeyResultViewBinding

  @Field(() => [Int])
  rank: Array<KeyResult['id']>

  @Field(() => [KeyResult])
  keyResults: KeyResult[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => User)
  user: User
}
