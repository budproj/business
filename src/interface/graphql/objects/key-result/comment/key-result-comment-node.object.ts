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
  @Field(() => String, { complexity: 0, description: 'The text of the comment' })
  public text: string

  @Field({ complexity: 0, description: 'The last update date of the comment' })
  public updatedAt: Date

  @Field(() => ID, {
    complexity: 0,
    description: 'The key result ID that this comment is related to',
  })
  public keyResultId: KeyResultNodeGraphQLObject['id']

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this comment' })
  public userId: UserNodeGraphQLObject['id']

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => KeyResultNodeGraphQLObject, {
    complexity: 1,
    description: 'The key result that this comment relates to',
  })
  public keyResult: KeyResultNodeGraphQLObject

  @Field(() => UserNodeGraphQLObject, {
    complexity: 1,
    description: 'The user that owns this comment',
  })
  public user: UserNodeGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
