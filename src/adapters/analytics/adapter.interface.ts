import { ProgressRecord } from './progress-record.interface'

export interface AnalyticsAdapter {
  getWeeklyProgressHistoryForKeyResult: (keyResultID: string) => Promise<ProgressRecord[]>
}
