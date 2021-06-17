import { Field, Float, ObjectType } from '@nestjs/graphql'

import { DeltaGraphQLObject } from '@interface/graphql/objects/delta.object'

@ObjectType('KeyResultCheckInDelta', {
  description:
    "The delta of a key-result check-in. This key contains the difference between a given check-in and it's parent",
})
export class KeyResultCheckInDeltaGraphQLObject extends DeltaGraphQLObject {
  @Field(() => Float, {
    complexity: 0,
    description: 'The value increase comparing to previous check-in',
  })
  public readonly value!: number

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly progress!: number
  public readonly confidence!: number
}
