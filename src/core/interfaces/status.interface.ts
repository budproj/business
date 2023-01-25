import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckMarkInterface } from '@core/modules/key-result/check-mark/key-result-check-mark.interface'

export interface Status {
  progress: number
  confidence: number
  isOutdated: boolean
  isActive?: boolean
  reportDate?: Date
  latestCheckIn?: KeyResultCheckInInterface
  allUpToDateCheckIns?: KeyResultCheckInInterface[]
  checkmarks?: KeyResultCheckMarkInterface[]
  total?: number
}

export interface GetStatusOptions {
  date?: Date
}
