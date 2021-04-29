import { Field, InputType } from '@nestjs/graphql'

import { Sorting } from '@core/enums/sorting'
import { SortingGraphQLEnum } from '@interface/graphql/enums/sorting.enum'
import { OrderGraphQLObject } from '@interface/graphql/objects/order.object'

@InputType('UserOrderInput', { description: 'Defines the expected options for user sorting' })
export class UserOrderInputObject extends OrderGraphQLObject {
  @Field(() => SortingGraphQLEnum, {
    nullable: true,
    description: 'Defines the expected order for the firstName attribute',
  })
  public firstName!: Sorting

  public createdAt!: Sorting
}
