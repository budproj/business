import { DOMAIN_QUERY_ORDER } from 'src/domain/constants'

import { Cycle } from './entities'

export interface CycleQueryOptions {
  limit?: number
  orderBy?: Array<[keyof Cycle, DOMAIN_QUERY_ORDER]>
}
