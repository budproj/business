import { CoreEntityInterface } from '@core/core-entity.interface'
import { KeyResultType } from '@core/modules/key-result/enums/key-result-type.enum'

import { KeyResultFormat } from '../enums/key-result-format.enum'

export interface KeyResultInterface extends CoreEntityInterface {
  title: string
  initialValue: number
  goal: number
  format: KeyResultFormat
  type: KeyResultType
  updatedAt: Date
  ownerId: string
  objectiveId: string
  teamId?: string
  description?: string
  commentCount?: JSON
}
