import { Sorting } from '@core/enums/sorting'

export interface GetOptions<E> {
  limit?: number
  offset?: number
  orderBy?: Partial<Record<keyof E, Sorting>>
}
