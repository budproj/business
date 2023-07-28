import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { WithOnly } from '@core/modules/workspace/aggregate-executor'
import { OkrType } from '@core/modules/workspace/segment.factory'

export type StatusLatestCheckIn = KeyResultCheckInInterface & {
  user: {
    id: string
    fullName: string
  }
}

export type Status = {
  progress?: number
  confidence?: number
  isActive?: boolean
  isOutdated?: boolean
  latestCheckIn?: StatusLatestCheckIn | null
  // TODO: allUpToDateCheckIns?: KeyResultCheckInInterface[]
  // TODO: checkmarks?: KeyResultCheckMarkInterface[]
  // TODO: total?: number
}

/**
 * TODO: add indexes
 */
export type Filters<T extends Status = Status, K extends keyof T = keyof T> = {
  okrType?: OkrType
  cycleIsActive?: boolean
  since?: Date
  include: K[]
}

export type StatusWithOnly<K extends keyof T, T extends Status = Status> = WithOnly<T, K>
