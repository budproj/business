import { CycleInterface } from '@core/modules/cycle/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/key-result.interface'
import { UserInterface } from '@core/modules/user/user.interface'

export interface ObjectiveInterface {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  cycleId: CycleInterface['id']
  cycle: CycleInterface
  ownerId: UserInterface['id']
  owner: UserInterface
  keyResults?: KeyResultInterface[]
}
