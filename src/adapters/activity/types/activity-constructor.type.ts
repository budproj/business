import { State } from '@adapters/state/interfaces/state.interface'

import { Activity } from '../activities/base.activity'

export type ActivityConstructor<D, R = Record<string, any>> = new (
  data: D,
  context: State,
  request: R,
) => Activity<D>
