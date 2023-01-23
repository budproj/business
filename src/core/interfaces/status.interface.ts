import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'

export interface Status {
  progress: number
  confidence: number
  isOutdated: boolean
  isActive?: boolean
  reportDate?: Date
  latestCheckIn?: KeyResultCheckInInterface
  allUpToDateCheckIns?: KeyResultCheckInInterface[]
  total?: number
}

export interface GetStatusOptions {
  date?: Date
}
