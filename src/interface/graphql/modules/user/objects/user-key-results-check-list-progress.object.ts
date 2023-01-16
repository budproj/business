import { Field, ObjectType } from '@nestjs/graphql'

import { OrderGraphQLObject } from '@interface/graphql/objects/order.object'

@ObjectType('UserKeyResultsCheckListProgress', {
  description: 'Defines the expected output of the key results check list progress command',
})
export class UserKeyResultsCheckListProgressObject extends OrderGraphQLObject {
  @Field(() => Number, {
    nullable: true,
  })
  public checked!: number

  @Field(() => Number, {
    nullable: true,
  })
  public total!: number
}
