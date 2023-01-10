import { Field, ObjectType } from '@nestjs/graphql'

import { DeltaGraphQLObject } from '@interface/graphql/objects/delta.object'
import { OrderGraphQLObject } from '@interface/graphql/objects/order.object'

@ObjectType('UserKeyResultsProgressAndDelta', {
  description: 'Defines the expected output of the key results progress command',
})
export class UserKeyResultsProgressAndDeltaObject extends OrderGraphQLObject {
  @Field(() => Number, {
    nullable: true,
  })
  public progress!: number

  @Field(() => DeltaGraphQLObject, {
    nullable: true,
  })
  public delta!: { progress: number; confidence: number }
}
