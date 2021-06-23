import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'

export type OKRTreeFilters = {
  keyResultCheckIn?: Partial<KeyResultCheckInInterface>
  keyResult?: Partial<KeyResultInterface>
  objective?: Partial<ObjectiveInterface>
  cycle?: Partial<CycleInterface>
}
