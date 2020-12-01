import { ConfidenceReportDTO } from 'domain/key-result-report/confidence/dto'
import { ProgressReportDTO } from 'domain/key-result-report/progress/dto'
import { KeyResultDTO } from 'domain/key-result/dto'
import { UserDTO } from 'domain/user/dto'

export interface CheckIn {
  userId: UserDTO['id']
  keyResultId: KeyResultDTO['id']
  progress: ProgressReportDTO['valueNew']
  confidence?: ConfidenceReportDTO['valueNew']
  comment?: string
}
