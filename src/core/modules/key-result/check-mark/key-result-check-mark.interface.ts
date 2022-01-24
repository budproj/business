import { CoreEntityInterface } from '@core/core-entity.interface'

export enum CheckMarkStates {
  CHECKED = 'checked',
  UNCHECKED = 'unchecked',
}

export interface KeyResultCheckMarkInterface extends CoreEntityInterface {
  state: CheckMarkStates
  description: string
  updatedAt: Date
  keyResultId: string
  assignedUserId: string
  userId: string
}

export type CheckList = KeyResultCheckMarkInterface[]
