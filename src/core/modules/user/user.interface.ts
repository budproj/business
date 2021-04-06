import { TeamInterface } from '@core/modules/team/team.interface'

import { UserGender } from './enums/user-gender.enum'

export interface UserInterface {
  id: string
  firstName: string
  authzSub: string
  createdAt: Date
  updatedAt: Date
  lastName?: string
  gender?: UserGender
  role?: string
  picture?: string
  nickname?: string
  about?: string
  linkedInProfileAddress?: string
  teams?: Promise<TeamInterface[]> | TeamInterface[]
  ownedTeams?: TeamInterface[]
}
