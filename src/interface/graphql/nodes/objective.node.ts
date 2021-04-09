import { Field, ID, ObjectType } from '@nestjs/graphql'

import { PolicyGraphQLObject } from '../authorization/objects/policy.object'
import { NodeGraphQLInterface } from '../interfaces/node.interface'

import { CycleGraphQLNode } from './cycle.node'
import { KeyResultGraphQLNode } from './key-result.node'
import { UserGraphQLNode } from './user.node'

@ObjectType('Objective', {
  implements: () => NodeGraphQLInterface,
  description:
    'The current status of this objective. By status we mean progress, confidence, and other reported values from it',
})
export class ObjectiveGraphQLNode implements NodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The title of the objective' })
  public title: string

  @Field({ complexity: 0, description: 'The last update date of the objective' })
  public updatedAt: Date

  @Field(() => ID, { complexity: 0, description: 'The cycle ID that owns this objective' })
  public cycleId: CycleGraphQLNode['id']

  @Field(() => ID, { complexity: 0, description: 'The user ID that owns this objective' })
  public ownerId: UserGraphQLNode['id']

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => CycleGraphQLNode, {
    complexity: 1,
    description: 'The cycle that owns this objective',
  })
  public cycle: CycleGraphQLNode

  @Field(() => UserGraphQLNode, {
    complexity: 1,
    description: 'The user that owns this objective',
  })
  public owner: UserGraphQLNode

  // **********************************************************************************************
  // EDGE FIELDS
  // **********************************************************************************************

  @Field(() => [KeyResultGraphQLNode], {
    complexity: 0,
    nullable: true,
    description: 'A creation date ordered list of key results that belongs to this objective',
  })
  public keyResults?: KeyResultGraphQLNode[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
