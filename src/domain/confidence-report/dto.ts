import { KeyResultDTO } from 'domain/key-result/dto'

export class ConfidenceReportDTO {
  id: number
  valuePrevious?: number
  valueNew: number
  comment?: string
  createdAt: Date
  keyResultId: KeyResultDTO['id']
}
