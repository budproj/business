import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { KeyResult } from 'app/graphql/key-result/models'
import { User } from 'app/graphql/user/models'
import { KeyResultViewBinding } from 'domain/key-result-view/dto'

registerEnumType(KeyResultViewBinding, {
  name: 'KeyResultViewBinding',
  description: 'Each binding represents a given view in our applications',
})

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

@InputType()
export class KeyResultViewInput {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  binding?: KeyResultViewBinding

  @Field(() => [Int])
  rank: Array<KeyResult['id']>
}

@InputType()
export class KeyResultViewRankInput {
  @Field(() => [Int])
  rank: Array<KeyResult['id']>
}
