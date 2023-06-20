import { differenceInDays } from 'date-fns'

import { Status } from '@core/interfaces/status.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserStatus } from '@core/modules/user/enums/user-status.enum'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'
import { GetTeamMembersCommandResult } from "@core/ports/commands/get-team-members.command";

interface UserWithLastCheckInAndRoutines extends User {
  latestCheckIn: KeyResultCheckInInterface
  lastRoutine: Routine
  total: number
}

interface Routine {
  id: string
  companyId: string
  userId: string
  timestamp: Date
  answers: Array<{
    id: string
    questionId: string
    answerGroupId: string
    value: any
  }>
}

export class GetTeamScore extends Command<any> {
  public async execute(
    teamID: Team['id'],
    allUsers = false,
  ): Promise<UserWithLastCheckInAndRoutines[]> {
    const getTeamMembersCommand = this.factory.buildCommand<GetTeamMembersCommandResult>('get-team-members')
    const getUserKeyResultsStatus = this.factory.buildCommand<Status>('get-user-key-results-status')
    const getUserCompaines = this.factory.buildCommand<Team[]>('get-user-companies')

    const { users } = await getTeamMembersCommand.execute(teamID, { status: UserStatus.ACTIVE })

    const usersWithLastCheckInAndRoutines = await Promise.all(
      users.map(async (user) => {
        const companies = await getUserCompaines.execute(user)

        const userWithCompanies = { ...user, companies }

        const lastRoutine = await this.core.nats.sendMessage<Routine[]>(
          'routines-microservice.user-last-routine',
          { user: userWithCompanies },
        )

        const { latestCheckIn, total } = await getUserKeyResultsStatus.execute(user.id)

        return { ...user, lastRoutine: lastRoutine[0], latestCheckIn, total }
      }),
    )

    const sortedUsers = usersWithLastCheckInAndRoutines.sort((a, b) => {
      return this.getUserScore(b) - this.getUserScore(a)
    })

    return allUsers ? sortedUsers : sortedUsers.slice(0, 10)
  }

  private getUserScore(user: UserWithLastCheckInAndRoutines) {
    let score = 0

    const addScore = (value: number) => {
      score += value
    }

    if (user.lastRoutine) {
      const feelingAnswerValue = Number(user.lastRoutine.answers[0].value)
      const productivityAnswerValue = Number(user.lastRoutine.answers[1].value)
      const roadblockAnswerValue = user.lastRoutine.answers[2].value

      if ([4, 5].includes(feelingAnswerValue)) {
        addScore(0)
      } else if ([3].includes(feelingAnswerValue)) {
        addScore(1)
      } else if ([2].includes(feelingAnswerValue)) {
        addScore(2)
      } else {
        addScore(3)
      }

      if ([4, 5].includes(productivityAnswerValue)) {
        addScore(0)
      } else if ([3].includes(productivityAnswerValue)) {
        addScore(1)
      } else if ([2].includes(productivityAnswerValue)) {
        addScore(2)
      } else {
        addScore(3)
      }

      addScore(roadblockAnswerValue === 'y' ? 3 : 0)
    } else {
      addScore(4)
    }

    if (user.total > 0) {
      if (user.latestCheckIn) {
        const daysDifference = differenceInDays(new Date(), user.latestCheckIn.createdAt)

        if ([0, 1, 2, 3, 4, 5, 6, 7].includes(daysDifference)) {
          addScore(0)
        } else if ([8].includes(daysDifference)) {
          addScore(1)
        } else if ([9].includes(daysDifference)) {
          addScore(2)
        } else if ([10].includes(daysDifference)) {
          addScore(3)
        } else {
          addScore(4)
        }
      } else {
        addScore(4)
      }
    }

    return score
  }
}
