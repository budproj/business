import { UserInterface } from '@core/modules/user/user.interface'

import { TeamGender } from './enums/team-gender.enum'

export interface TeamInterface {
  id: string
  name: string
  description?: string
  gender?: TeamGender
  createdAt: Date
  updatedAt: Date
  ownerId: UserInterface['id']
  owner: UserInterface
  parentId?: TeamInterface['id']
  parent?: TeamInterface
  teams?: TeamInterface[]
}
