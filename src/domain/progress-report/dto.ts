import { KeyResultDTO } from 'domain/key-result/dto'

export class ProgressReportDTO {
  id: number
  valuePrevious?: number
  valueNew: number
  comment?: string
  createdAt: Date
  keyResultId: KeyResultDTO['id']
}
