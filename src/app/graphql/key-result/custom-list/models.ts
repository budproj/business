import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { UserObject } from 'src/app/graphql/user/models'
import { KEY_RESULT_CUSTOM_LIST_BINDING } from 'src/domain/key-result/custom-list/constants'

@ObjectType('KeyResultCustomList', {
  description:
    'A view created by an user that represents a custom key result ranking for a given binding',
})
export class KeyResultCustomListObject {
  @Field(() => ID, { description: 'The ID of the key result view' })
  id: string

  @Field({ description: 'The creation date of this view' })
  createdAt: Date

  @Field({ description: 'The last update date of this view' })
  updatedAt: Date

  @Field(() => ID, { description: 'The ID of the uswer that owns this view' })
  userId: UserObject['id']

  @Field(() => UserObject, { description: 'The user that owns this view' })
  user: UserObject

  @Field({ nullable: true, description: 'The title of the key result view' })
  title?: string

  @Field({
    description: 'An anchor between this view and a fixed tab in our applications',
    nullable: true,
  })
  binding?: KEY_RESULT_CUSTOM_LIST_BINDING

  @Field(() => [ID], { description: 'Ordered list of key result IDs', nullable: true })
  rank?: Array<KeyResultObject['id']>

  @Field(() => [KeyResultObject], {
    description: 'The rank ordered list of key results in that view',
    nullable: true,
  })
  keyResults?: KeyResultObject[]
}

// @InputType({ description: 'Required data to update a given key result view rank' })
// export class KeyResultCustomListRankInput {
//   @Field(() => [ID], { description: 'Ordered list of key result IDs' })
//   rank: Array<KeyResultObject['id']>
// }

registerEnumType(KEY_RESULT_CUSTOM_LIST_BINDING, {
  name: 'KEY_RESULT_CUSTOM_LIST_BINDING',
  description: 'Each binding represents a given key result custom list in our applications',
})
