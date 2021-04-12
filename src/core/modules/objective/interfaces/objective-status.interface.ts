import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultStatus } from '@core/modules/key-result/interfaces/key-result-status.interface'

export interface ObjectiveStatus extends KeyResultStatus {
  latestKeyResultCheckIn?: KeyResultCheckInInterface
}
