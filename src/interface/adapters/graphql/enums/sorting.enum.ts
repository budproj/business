import { registerEnumType } from '@nestjs/graphql'

import { DOMAIN_SORTING } from 'src/domain/constants'

export const SortingGraphQLEnum = DOMAIN_SORTING

registerEnumType(SortingGraphQLEnum, {
  name: 'Sorting',
  description: 'Defines the order to return your results in a given query',
})
