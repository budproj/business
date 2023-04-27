import { KeyResultType } from '@core/modules/key-result/enums/key-result-type.enum'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultFormat } from '../enums/key-result-format.enum'
import { KeyResultMode } from '../enums/key-result-mode.enum'

export interface KeyResultStateInterface {
  mode: KeyResultMode
  title: string
  goal: number
  format: KeyResultFormat
  type: KeyResultType
  ownerId: string
  description: string
  author: UserInterface
}
