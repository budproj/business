import { KeyResultType } from '@core/modules/key-result/enums/key-result-type.enum'

export interface KeyResultData {
  initialValue: number
  goal: number
  type: KeyResultType
}
