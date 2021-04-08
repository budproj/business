import { ObjectiveInterface } from '@core/modules/objective/objective.interface'
import { TeamInterface } from '@core/modules/team/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultCommentInterface } from './comment/key-result-comment.interface'
import { KeyResultFormat } from './enums/key-result-format.enum'

export interface KeyResultInterface {
  id: string
  title: string
  initialValue: number
  goal: number
  format: KeyResultFormat
  createdAt: Date
  updatedAt: Date
  ownerId: UserInterface['id']
  owner: UserInterface
  objectiveId: ObjectiveInterface['id']
  objective: ObjectiveInterface
  teamId: TeamInterface['id']
  team: TeamInterface
  description?: string
  comments?: KeyResultCommentInterface[]
}
