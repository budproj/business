import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

export interface Status {
  progress: number
  confidence: number
  reportDate?: Date
  latestCheckIn?: KeyResultCheckIn
}

export interface GetStatusOptions {
  date?: Date
  active?: boolean
}
