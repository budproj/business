import { CoreEntityInterface } from '@core/core-entity.interface'

import { KeyResultFormat } from '../enums/key-result-format.enum'

export interface KeyResultInterface extends CoreEntityInterface {
  title: string
  initialValue: number
  goal: number
  format: KeyResultFormat
  updatedAt: Date
  ownerId: string
  objectiveId: string
  teamId: string
  description?: string
}
