import { TaskInterface, TaskStates } from '@core/modules/task/task.interface'

export type CheckMarkStates = TaskStates
export const CheckMarkStates = { ...TaskStates }
export interface KeyResultCheckMarkInterface extends TaskInterface {
  assignedUserId: string
}

export type CheckList = KeyResultCheckMarkInterface[]
