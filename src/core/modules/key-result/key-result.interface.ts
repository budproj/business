import { CoreEntityInterface } from '@core/core-entity.interface'
import { ObjectiveInterface } from '@core/modules/objective/objective.interface'
import { TeamInterface } from '@core/modules/team/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { KeyResultFormat } from './enums/key-result-format.enum'
import { KeyResultCheckInInterface } from './modules/check-in/key-result-check-in.interface'
import { KeyResultCommentInterface } from './modules/comment/key-result-comment.interface'

export interface KeyResultInterface extends CoreEntityInterface {
  title: string
  initialValue: number
  goal: number
  format: KeyResultFormat
  updatedAt: Date
  ownerId: UserInterface['id']
  owner: UserInterface
  objectiveId: ObjectiveInterface['id']
  objective: ObjectiveInterface
  teamId: TeamInterface['id']
  team: TeamInterface
  description?: string
  comments?: KeyResultCommentInterface[]
  checkIns?: KeyResultCheckInInterface[]
}
