import { Context } from '@adapters/context/interfaces/context.interface'

import { Activity } from '../activities/base.activity'

export type ActivityConstructor<D> = new (data: D, context: Context) => Activity<D>
