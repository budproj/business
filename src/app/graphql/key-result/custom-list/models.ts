import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { EntityObject } from 'src/app/graphql/models'
import { UserObject } from 'src/app/graphql/user/models'
import { KEY_RESULT_CUSTOM_LIST_BINDING } from 'src/domain/key-result/custom-list/constants'

registerEnumType(KEY_RESULT_CUSTOM_LIST_BINDING, {
  name: 'KEY_RESULT_CUSTOM_LIST_BINDING',
  description: 'Each binding represents a given key result custom list in our applications',
})

@ObjectType('KeyResultCustomList', {
  implements: () => EntityObject,
  description:
    'A view created by an user that represents a custom key result ranking for a given binding',
})
export class KeyResultCustomListObject implements EntityObject {
  @Field({ description: 'The creation date of this view' })
  public createdAt: Date

  @Field({ description: 'The last update date of this view' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The ID of the uswer that owns this view' })
  public userId: UserObject['id']

  @Field(() => UserObject, { description: 'The user that owns this view' })
  public user: UserObject

  @Field({ nullable: true, description: 'The title of the key result view' })
  public title?: string

  @Field({
    description: 'An anchor between this view and a fixed tab in our applications',
    nullable: true,
  })
  public binding?: KEY_RESULT_CUSTOM_LIST_BINDING

  @Field(() => [ID], { description: 'Ordered list of key result IDs', nullable: true })
  rank?: Array<KeyResultObject['id']>

  @Field(() => [KeyResultObject], {
    description: 'The rank ordered list of key results in that view',
    nullable: true,
  })
  public keyResults?: KeyResultObject[]

  public id: string
  public policies: PolicyObject
}

@InputType({ description: 'Required data to update a given key result custom list' })
export class KeyResultCustomListInput {
  @Field(() => [ID], { description: 'Ordered list of key result IDs' })
  public rank: Array<KeyResultObject['id']>
}
