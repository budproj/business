import { CoreEntityInterface } from '@core/core-entity.interface'

import { TeamGender } from './enums/team-gender.enum'

export interface TeamInterface extends CoreEntityInterface {
  name: string
  description?: string
  gender?: TeamGender
  updatedAt: Date
  ownerId: string
  parentId?: string
}
