import { CoreEntityInterface } from '@core/core-entity.interface'

export enum TaskStates {
  CHECKED = 'checked',
  UNCHECKED = 'unchecked',
}

export interface TaskInterface extends CoreEntityInterface {
  state: TaskStates
  description: string
  updatedAt: Date
  assignedUserId: string
  userId: string
}
