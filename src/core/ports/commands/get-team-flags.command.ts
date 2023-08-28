import { differenceInDays } from 'date-fns'
import { flatten } from 'lodash'
import { Any } from 'typeorm'

import { CONFIDENCE_TAG_THRESHOLDS } from '@adapters/confidence-tag/confidence-tag.constants'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserStatus } from '@core/modules/user/enums/user-status.enum'

import { BaseStatusCommand } from './base-status.command'

export class GetTeamFlagsCommand extends BaseStatusCommand {
  public async execute(teamId: TeamInterface['id']): Promise<any> {
    const keyResultsFromTeam = await this.core.keyResult.getKeyResults(
      [teamId],
      undefined,
      undefined,
      undefined,
      undefined,
      ['checkIns'],
    )

    const categorizedKeyResults: {
      lowConfidence: KeyResult[]
      barried: KeyResult[]
      outdated: KeyResult[]
    } = keyResultsFromTeam.reduce(
      (categories, keyResult) => {
        const latestCheckin = this.getLatestCheckInFromList(keyResult.checkIns)

        const isKeyResultInOperation =
          latestCheckin?.confidence !== CONFIDENCE_TAG_THRESHOLDS.deprioritized &&
          latestCheckin?.confidence !== CONFIDENCE_TAG_THRESHOLDS.achieved

        const isOutdated = latestCheckin
          ? this.isOutdated(latestCheckin, new Date())
          : differenceInDays(Date.now(), keyResult.createdAt) > 6

        if (isKeyResultInOperation && isOutdated) {
          categories.outdated.push(keyResult)
        }

        if (latestCheckin) {
          switch (latestCheckin.confidence) {
            case CONFIDENCE_TAG_THRESHOLDS.low:
              categories.lowConfidence.push(keyResult)
              break

            case CONFIDENCE_TAG_THRESHOLDS.barrier:
              categories.barried.push(keyResult)
              break

            case CONFIDENCE_TAG_THRESHOLDS.achieved:
            case CONFIDENCE_TAG_THRESHOLDS.deprioritized:
              break

            default:
              return categories
          }
        }

        return categories
      },
      { lowConfidence: [], barried: [], outdated: [] },
    )

    const teams = await this.core.team.getDescendantsByIds([teamId])

    const teamUsersPromises = teams.map(async (team) => team.users)
    const teamsUsers = await Promise.all(teamUsersPromises)

    const userIDs = flatten(teamsUsers).map((u) => u.id)
    const selector = {
      id: Any(userIDs),
    }

    const keyResultOwnersIds = keyResultsFromTeam.map(({ ownerId }) => ownerId)
    const keyResultsSupportTeam = keyResultsFromTeam.map(async (keyResult) => {
      const supportTeam = await this.core.keyResult.getSupportTeam(keyResult.id)
      return supportTeam
    })

    const keyResultSupportTeamIDs = (await Promise.all(keyResultsSupportTeam))
      .flat()
      .map(({ id }) => id)

    const teamUsers = await this.core.user.getMany(selector)
    const teamOwnerId = (await this.core.team.getOne({ id: teamId })).ownerId
    const teamOwner = await this.core.user.getFromID(teamOwnerId)

    const uniqueUsers = teamUsers.filter((user) => teamOwner?.id !== user.id)

    const allUsersFromTeam = [...uniqueUsers, teamOwner].filter(
      (user) => user.status === UserStatus.ACTIVE,
    )

    const noRelatedToOkr = allUsersFromTeam.filter(
      ({ id }) => ![...keyResultOwnersIds, ...keyResultSupportTeamIDs].includes(id),
    )

    return {
      outdated: categorizedKeyResults.outdated,
      barrier: categorizedKeyResults.barried,
      low: categorizedKeyResults.lowConfidence,
      noRelated: noRelatedToOkr,
    }
  }
}
