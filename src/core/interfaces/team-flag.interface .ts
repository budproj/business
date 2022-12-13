import { CoreEntityInterface } from '@core/core-entity.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

export type TeamFlag = CoreEntityInterface & {
  outdated: KeyResult[]
  barrier: KeyResult[]
  low: KeyResult[]
  noRelated: User[]
}
