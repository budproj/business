import { Field, ID, InputType, ObjectType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { DeleteResultObject, EntityObject } from 'src/app/graphql/models'
import { UserObject } from 'src/app/graphql/user/models'

@ObjectType('KeyResultComment', {
  implements: () => EntityObject,
  description: 'A comment in a given key result',
})
export class KeyResultCommentObject implements EntityObject {
  @Field(() => String, { description: 'The text of the comment' })
  public text: string

  @Field({ description: 'The creation date of the comment' })
  public createdAt: Date

  @Field({ description: 'The last update date of the comment' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The key result ID that this comment is related to' })
  public keyResultId: KeyResultObject['id']

  @Field(() => KeyResultObject, { description: 'The key result that this comment relates to' })
  public keyResult: KeyResultObject

  @Field(() => ID, { description: 'The user ID that owns this comment' })
  public userId: UserObject['id']

  @Field(() => UserObject, { description: 'The user that owns this comment' })
  public user: UserObject

  public id: string
  public policies: PolicyObject
}

@ObjectType('KeyResultCommentDeleteResult', {
  implements: () => DeleteResultObject,
  description: 'The delete result from a delete mutation for key result comments',
})
export class KeyResultCommentDeleteResultObject implements DeleteResultObject {
  public affected: number
}

@InputType({ description: 'The required data to create a new comment' })
export class KeyResultCommentInput {
  @Field(() => String, { description: 'The text of the comment' })
  public text: string

  @Field(() => ID, { description: 'The key result ID related to this comment' })
  public keyResultId: KeyResultObject['id']
}
