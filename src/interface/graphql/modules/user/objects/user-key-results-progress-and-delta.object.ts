import { Field, ObjectType } from '@nestjs/graphql'

import { Delta } from '@core/interfaces/delta.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { DeltaGraphQLObject } from '@interface/graphql/objects/delta.object'
import { OrderGraphQLObject } from '@interface/graphql/objects/order.object'

import { KeyResultCheckInObject } from './user-key-results-check-in.object'

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
  public delta!: Delta

  @Field(() => KeyResultCheckInObject, {
    nullable: true,
  })
  public latestCheckIn!: KeyResultCheckInInterface
}
