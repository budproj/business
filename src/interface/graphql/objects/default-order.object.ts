import { Field, InputType } from '@nestjs/graphql'

import { Sorting } from '@core/enums/sorting'

import { SortingGraphQLEnum } from '../enums/sorting.enum'

import { OrderGraphQLObject } from './order.object'

@InputType('DefaultOrderInput', {
  description: 'Defines the default expected order for a given entity',
})
export class DefaultOrderGraphQLInput extends OrderGraphQLObject {
  @Field(() => SortingGraphQLEnum, {
    nullable: true,
    description: 'Defines the expected order for the createdAt attribute',
  })
  public createdAt: Sorting
}
