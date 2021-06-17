import { Field, Float, Int, ObjectType } from '@nestjs/graphql'

import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/modules/key-result/check-in/key-result-check-in.node'

@ObjectType('Status', {
  description:
    "The current status of an entity. By status we mean progress, confidence, and other reported values from it's children",
})
export class StatusGraphQLObject {
  @Field(() => Float, {
    complexity: 0,
    description:
      'The computed percentage current progress of this entity. The entity progress calculation vary based on the entity',
  })
  public readonly progress!: number

  @Field(() => Int, {
    complexity: 0,
    description:
      "The computed current confidence of this entity. The confidence is always the lowest among the entity's children",
  })
  public readonly confidence!: number

  @Field(() => Date, {
    complexity: 0,
    description: 'The latest check-in date in this status',
    nullable: true,
  })
  public readonly reportDate?: Date

  @Field(() => KeyResultCheckInGraphQLNode, {
    complexity: 0,
    description: 'The latest check-in date in this status',
    nullable: true,
  })
  public readonly latestCheckIn?: KeyResultCheckIn
}
