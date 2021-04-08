import { Field, ID, ObjectType } from '@nestjs/graphql'

import { NodeGraphQLInterface } from '../../../interfaces/node.interface'
import { PolicyGraphQLObject } from '../../authorization/policy.object'
import { UserNodeGraphQLObject } from '../../user/user-node.object'
import { KeyResultNodeGraphQLObject } from '../key-result-node.object'

@ObjectType('KeyResultComment', {
  implements: () => NodeGraphQLInterface,
  description: 'A comment in a given key result',
})
export class KeyResultCommentNodeGraphQLObject implements NodeGraphQLInterface {
  @Field(() => String, { description: 'The text of the comment' })
  public text: string

  @Field({ description: 'The last update date of the comment' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The key result ID that this comment is related to' })
  public keyResultId: KeyResultNodeGraphQLObject['id']

  @Field(() => KeyResultNodeGraphQLObject, {
    description: 'The key result that this comment relates to',
  })
  public keyResult: KeyResultNodeGraphQLObject

  @Field(() => ID, { description: 'The user ID that owns this comment' })
  public userId: UserNodeGraphQLObject['id']

  @Field(() => UserNodeGraphQLObject, { description: 'The user that owns this comment' })
  public user: UserNodeGraphQLObject

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
