import { CoreEntityInterface } from '@core/core-entity.interface'

import { KeyResultPatchInterface } from '../interfaces/key-result-patch.interface'
import { KeyResultStateInterface } from '../interfaces/key-result-state.interface'

export interface KeyResultUpdateInterface extends CoreEntityInterface {
  keyResultId: string
  oldState: KeyResultStateInterface
  patches: KeyResultPatchInterface[]
  newState: KeyResultStateInterface
}
