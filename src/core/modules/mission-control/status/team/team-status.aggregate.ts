import { WithOnly } from '@core/modules/workspace/aggregate-executor'

import { Status } from '../status.aggregate'

export type TeamStatus = Pick<Status, 'progress' | 'confidence' | 'latestCheckIn' | 'isActive' | 'isOutdated'>

export type TeamStatusWithOnly<K extends keyof TeamStatus> = WithOnly<TeamStatus, K>
