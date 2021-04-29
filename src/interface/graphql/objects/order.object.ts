import { Field } from '@nestjs/graphql'

import { Sorting } from '@core/enums/sorting'

import { SortingGraphQLEnum } from '../enums/sorting.enum'

export abstract class OrderGraphQLObject {
  @Field(() => SortingGraphQLEnum, {
    nullable: true,
    description: 'Defines the expected order for the createdAt attribute',
  })
  public createdAt: Sorting
}
