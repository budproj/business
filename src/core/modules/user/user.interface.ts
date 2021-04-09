import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCommentInterface } from '@core/modules/key-result/comment/key-result-comment.interface'
import { KeyResultInterface } from '@core/modules/key-result/key-result.interface'
import { ObjectiveInterface } from '@core/modules/objective/objective.interface'
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
  teams?: Promise<TeamInterface[]>
  ownedTeams?: TeamInterface[]
  objectives?: ObjectiveInterface[]
  keyResults?: KeyResultInterface[]
  keyResultComments?: KeyResultCommentInterface[]
  keyResultCheckIns?: KeyResultCheckInInterface[]
}
