import { CycleInterface } from '@core/modules/cycle/cycle.interface'
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
}
