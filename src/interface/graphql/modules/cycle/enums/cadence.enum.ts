import { registerEnumType } from '@nestjs/graphql/dist'

import { Cadence } from '@core/modules/cycle/enums/cadence.enum'

export const CadenceGraphQLEnum = Cadence

registerEnumType(CadenceGraphQLEnum, {
  name: 'Cadence',
  description: 'Each cadence represents a period of time in which your cycles can be created',
})
