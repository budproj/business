import { WithOnly } from '@core/modules/workspace/aggregate-executor'

import { Status } from '../status.aggregate'

export type CycleStatus = Pick<Status, 'progress' | 'confidence' | 'latestCheckIn' | 'isActive' | 'isOutdated'>

export type CycleStatusWithOnly<K extends keyof CycleStatus> = WithOnly<CycleStatus, K>
