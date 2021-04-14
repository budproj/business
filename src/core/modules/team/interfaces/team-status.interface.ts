import { KeyResultStatus } from '@core/modules/key-result/interfaces/key-result-status.interface'
import { ObjectiveStatus } from '@core/modules/objective/interfaces/objective-status.interface'

export interface TeamStatus extends KeyResultStatus {
  latestObjectiveStatus?: ObjectiveStatus
}
