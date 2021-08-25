import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { ProgressRecord } from './progress-record.interface'

export interface AnalyticsAdapter {
  getWeeklyProgressHistoryForKeyResult: (
    keyResultID: string,
    latestCheckIn?: KeyResultCheckIn,
  ) => Promise<ProgressRecord[]>
}
