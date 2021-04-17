import { Field, InputType } from '@nestjs/graphql'

import { Sorting } from '@core/enums/sorting'

import { SortingGraphQLEnum } from '../enums/sorting.enum'

@InputType('OrderNode', {
  description: 'Defines the expected order for each node attribute',
})
export class OrderNodeGraphQLInput {
  @Field(() => SortingGraphQLEnum, {
    nullable: true,
    description: 'Defines the expected order for the createdAt attribute',
  })
  public createAt: Sorting
}
