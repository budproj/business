import { CoreEntityInterface } from '@core/core-entity.interface'

export enum CheckMarkStates {
  CHECKED = 'checked',
  UNCHECKED = 'unchecked',
}

export interface CheckMarkInterface extends CoreEntityInterface {
  state: CheckMarkStates
  description: string
  updatedAt: Date
  keyResultId: string
  userId: string
}

export type CheckList = CheckMarkInterface[]
