import { Field, ID, ObjectType } from '@nestjs/graphql'

import { NodeGraphQLInterface } from '../../interfaces/node.interface'
import { PolicyGraphQLObject } from '../authorization/policy.object'
import { CycleNodeGraphQLObject } from '../cycle/cycle-node.object'
import { KeyResultNodeGraphQLObject } from '../key-result/key-result-node.object'
import { UserNodeGraphQLObject } from '../user/user-node.object'

@ObjectType('Objective', {
  implements: () => NodeGraphQLInterface,
  description:
    'The current status of this objective. By status we mean progress, confidence, and other reported values from it',
})
export class ObjectiveNodeGraphQLObject implements NodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The title of the objective' })
  public title: string

  @Field({ complexity: 0, description: 'The last update date of the objective' })
  public updatedAt: Date

  @Field(() => ID, { complexity: 0, description: 'The cycle ID that owns this objective' })
  public cycleId: CycleNodeGraphQLObject['id']

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this objective' })
  public ownerId: UserNodeGraphQLObject['id']

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => CycleNodeGraphQLObject, {
    complexity: 1,
    description: 'The cycle that owns this objective',
  })
  public cycle: CycleNodeGraphQLObject

  @Field(() => UserNodeGraphQLObject, {
    complexity: 1,
    description: 'The user that owns this objective',
  })
  public owner: UserNodeGraphQLObject

  // **********************************************************************************************
  // EDGE FIELDS
  // **********************************************************************************************

  @Field(() => [KeyResultNodeGraphQLObject], {
    complexity: 0,
    nullable: true,
    description: 'A creation date ordered list of key results that belongs to this objective',
  })
  public keyResults?: KeyResultNodeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
