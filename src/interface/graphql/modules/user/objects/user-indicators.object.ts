import { Field, ObjectType } from '@nestjs/graphql'

import { Delta } from '@core/interfaces/delta.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { OrderGraphQLObject } from '@interface/graphql/objects/order.object'

import { UserKeyResultsCheckListAndCheckMarkProgressObject } from './user-key-results-check-list-and-check-mark-progress.object'
import { UserKeyResultsProgressAndDeltaObject } from './user-key-results-progress-and-delta.object'

@ObjectType('UserIndicators', {
  description: 'Defines the expected output of the key results progress command',
})
export class UserIndicatorsObject extends OrderGraphQLObject {
  @Field(() => UserKeyResultsProgressAndDeltaObject, {
    nullable: true,
  })
  public keyResultsProgress!: {
    progress: number
    delta: Delta
    latestCheckIn: KeyResultCheckInInterface
  }

  @Field(() => UserKeyResultsCheckListAndCheckMarkProgressObject, {
    nullable: true,
  })
  public keyResultsCheckListProgress!: { total: number; checked: number }

  @Field(() => UserKeyResultsCheckListAndCheckMarkProgressObject, {
    nullable: true,
  })
  public keyResultsCheckInProgress!: { total: number; checked: number }
}
