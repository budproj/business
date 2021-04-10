import { CoreEntityInterface } from '@core/core-entity.interface'
import { CycleInterface } from '@core/modules/cycle/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/key-result.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { TeamGender } from './enums/team-gender.enum'

export interface TeamInterface extends CoreEntityInterface {
  name: string
  description?: string
  gender?: TeamGender
  updatedAt: Date
  ownerId: UserInterface['id']
  owner: UserInterface
  parentId?: TeamInterface['id']
  parent?: TeamInterface
  teams?: TeamInterface[]
  cycles?: CycleInterface[]
  keyResults?: KeyResultInterface[]
}
