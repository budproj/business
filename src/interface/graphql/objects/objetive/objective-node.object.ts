import { Field, ID, ObjectType } from '@nestjs/graphql'

import { NodeGraphQLInterface } from '@interface/graphql/interfaces/node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/objects/authorization/policy.object'
import { CycleNodeGraphQLObject } from '@interface/graphql/objects/cycle/cycle-node.object'
import { KeyResultNodeGraphQLObject } from '@interface/graphql/objects/key-result/key-result-node.object'
import { UserNodeGraphQLObject } from '@interface/graphql/objects/user/user-node.object'

@ObjectType('Objective', {
  implements: () => NodeGraphQLInterface,
  description:
    'The current status of this objective. By status we mean progress, confidence, and other reported values from it',
})
export class ObjectiveNodeGraphQLObject implements NodeGraphQLInterface {
  @Field({ description: 'The title of the objective' })
  public title: string

  @Field({ description: 'The last update date of the objective' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The cycle ID that owns this objective' })
  public cycleId: CycleNodeGraphQLObject['id']

  @Field(() => CycleNodeGraphQLObject, { description: 'The cycle that owns this objective' })
  public cycle: CycleNodeGraphQLObject

  @Field(() => ID, { description: 'The user ID that owns this objective' })
  public ownerId: UserNodeGraphQLObject['id']

  @Field(() => UserNodeGraphQLObject, { description: 'The user that owns this objective' })
  public owner: UserNodeGraphQLObject

  @Field(() => [KeyResultNodeGraphQLObject], {
    description: 'A creation date ordered list of key results that belongs to this objective',
    nullable: true,
  })
  public keyResults?: KeyResultNodeGraphQLObject[]

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
