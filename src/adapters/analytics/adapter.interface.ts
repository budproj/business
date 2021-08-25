import { KeyResultData } from './key-result-data.interface'
import { ProgressRecord } from './progress-record.interface'

export interface AnalyticsAdapter {
  getWeeklyProgressHistoryForKeyResult: (keyResultID: string) => Promise<ProgressRecord[]>
  calculateProgress: (value: number, keyResultData: KeyResultData) => Promise<number>
}
