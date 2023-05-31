import { KeyResultType } from '@core/modules/key-result/enums/key-result-type.enum'

import { KeyResultFormat } from '../enums/key-result-format.enum'
import { KeyResultMode } from '../enums/key-result-mode.enum'

import { Author } from './key-result-author.interface'

export interface KeyResultStateInterface {
  mode: KeyResultMode
  title: string
  goal: number
  format: KeyResultFormat
  type: KeyResultType
  ownerId: string
  description: string
  author: Author
}
