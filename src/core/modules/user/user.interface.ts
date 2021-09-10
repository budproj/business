import { CoreEntityInterface } from '@core/core-entity.interface'

import { UserGender } from './enums/user-gender.enum'
import { UserStatus } from './enums/user-status.enum'

export interface UserInterface extends CoreEntityInterface {
  firstName: string
  authzSub: string
  email: string
  status: UserStatus
  updatedAt: Date
  lastName?: string
  gender?: UserGender
  role?: string
  picture?: string
  nickname?: string
  about?: string
  linkedInProfileAddress?: string
}
