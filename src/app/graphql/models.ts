import { registerEnumType } from '@nestjs/graphql'

import { DOMAIN_QUERY_ORDER } from 'src/domain/constants'

registerEnumType(DOMAIN_QUERY_ORDER, {
  name: 'QUERY_ORDER',
  description: 'Defines the order to return your results in a given query',
})
