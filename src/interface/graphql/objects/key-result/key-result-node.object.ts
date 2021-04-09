import { Field, Float, ID, ObjectType } from '@nestjs/graphql'

import { KeyResultFormat } from '@core/modules/key-result/enums/key-result-format.enum'

import { KeyResultFormatGraphQLEnum } from '../../enums/key-result-format.enum'
import { NodeGraphQLInterface } from '../../interfaces/node.interface'
import { PolicyGraphQLObject } from '../authorization/policy.object'
import { ObjectiveNodeGraphQLObject } from '../objetive/objective-node.object'
import { TeamNodeGraphQLObject } from '../team/team-node.object'
import { UserNodeGraphQLObject } from '../user/user-node.object'

import { KeyResultCommentNodeGraphQLObject } from './comment/key-result-comment-node.object'

@ObjectType('KeyResult', {
  implements: () => NodeGraphQLInterface,
  description:
    'The current status of this key-result. By status we mean progress, confidence, and other reported values from it',
})
export class KeyResultNodeGraphQLObject implements NodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The title of the key result' })
  public title: string

  @Field(() => Float, { complexity: 0, description: 'The initial value of the key result' })
  public initialValue: number

  @Field(() => Float, { complexity: 0, description: 'The goal of the key result' })
  public goal: number

  @Field(() => KeyResultFormatGraphQLEnum, {
    complexity: 0,
    description: 'The format of the key result',
  })
  public format: KeyResultFormat

  @Field({ complexity: 0, description: 'The last update date of the key result' })
  public updatedAt: Date

  @Field(() => ID, { complexity: 0, description: 'The owner ID of the key result' })
  public ownerId: UserNodeGraphQLObject['id']

  @Field(() => ID, { complexity: 0, description: 'The object ID that this key result belongs to' })
  public objectiveId: ObjectiveNodeGraphQLObject['id']

  @Field(() => ID, { complexity: 0, description: 'The team ID that this key result belongs to' })
  public teamId: TeamNodeGraphQLObject['id']

  @Field({
    complexity: 0,
    description: 'The description explaining the key result',
    nullable: true,
  })
  public description?: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field({
    complexity: 1,
    description:
      'Saying a key result is "outdated" means that the owner needs to do a new check-in to report the current key result progress',
  })
  public isOutdated?: boolean

  @Field(() => UserNodeGraphQLObject, { complexity: 1, description: 'The owner of the key result' })
  public owner: UserNodeGraphQLObject

  @Field(() => ObjectiveNodeGraphQLObject, {
    complexity: 1,
    description: 'The objective that this key result belongs to',
  })
  public objective: ObjectiveNodeGraphQLObject

  @Field(() => TeamNodeGraphQLObject, {
    complexity: 1,
    description: 'The team that this key result belongs to',
  })
  public team: TeamNodeGraphQLObject

  // **********************************************************************************************
  // EDGE FIELDS
  // **********************************************************************************************

  @Field(() => [KeyResultCommentNodeGraphQLObject], {
    description: 'A created date ordered list of key result comments for this key result',
    nullable: true,
  })
  public keyResultComments?: KeyResultCommentNodeGraphQLObject[]

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
