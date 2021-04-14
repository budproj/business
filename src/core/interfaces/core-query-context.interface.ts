import { CoreContext } from './core-context.interface'
import { QueryContext } from './query-context'

export interface CoreQueryContext extends CoreContext {
  query: QueryContext
}
