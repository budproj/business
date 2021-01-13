import { KeyResultDTO } from 'src/domain/key-result/dto'
import { UserDTO } from 'src/domain/user/dto'

export class ConfidenceReportDTO {
  id: string
  valuePrevious?: number
  valueNew: number
  comment?: string
  createdAt: Date
  keyResultId: KeyResultDTO['id']
  userId: UserDTO['id']
}
