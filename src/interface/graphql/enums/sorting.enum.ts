import { registerEnumType } from '@nestjs/graphql/dist'

import { Sorting } from '@core/enums/sorting'

export const SortingGraphQLEnum = Sorting

registerEnumType(SortingGraphQLEnum, {
  name: 'Sorting',
  description: 'Defines the order to return your results in a given query',
})
