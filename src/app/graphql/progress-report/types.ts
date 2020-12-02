import { ProgressReportDTO } from 'domain/key-result/report/progress/dto'

export interface ProgressReport {
  value: ProgressReportDTO['valueNew']
  keyResultId: ProgressReportDTO['keyResultId']
  comment?: ProgressReportDTO['comment']
}
