import { State } from '@adapters/state/interfaces/state.interface'

import { Activity } from '../activities/base.activity'

export type ActivityConstructor<D> = new (data: D, context: State) => Activity<D>
