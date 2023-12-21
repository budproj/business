import { FindConditions } from 'typeorm'

import { KeyResult } from '../key-result.orm-entity'

export type KeyResultFilters = FindConditions<KeyResult> & {
  limit: number
  offset: number
}
