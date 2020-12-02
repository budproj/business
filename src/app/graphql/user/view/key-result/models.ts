import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { KeyResultObject } from 'app/graphql/key-result/models'
import { UserObject } from 'app/graphql/user/models'
import { KeyResultViewBinding } from 'domain/user/view/key-result/types'

registerEnumType(KeyResultViewBinding, {
  name: 'KeyResultViewBinding',
  description: 'Each binding represents a given view in our applications',
})

@ObjectType()
export class KeyResultViewObject {
  @Field(() => Int)
  id: number

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  binding?: KeyResultViewBinding

  @Field(() => [Int])
  rank: Array<KeyResultObject['id']>

  @Field(() => [KeyResultObject])
  keyResults: KeyResultObject[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => UserObject)
  user: UserObject
}

@InputType()
export class KeyResultViewInput {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  binding?: KeyResultViewBinding

  @Field(() => [Int])
  rank: Array<KeyResultObject['id']>
}

@InputType()
export class KeyResultViewRankInput {
  @Field(() => [Int])
  rank: Array<KeyResultObject['id']>
}
