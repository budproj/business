import { differenceInDays } from 'date-fns'

import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'

import { BaseStatusCommand } from './base-status.command'

export class GetTeamFlagsCommand extends BaseStatusCommand {
  public async execute(teamId: TeamInterface['id']): Promise<any> {
    const keyResultsFromTeam = await this.core.keyResult.getKeyResults([teamId])
    const team = await this.core.team.getFromID(teamId)

    const keyResultOwnersIds = keyResultsFromTeam.map(({ ownerId }) => ownerId)
    const keyResultsSupportTeam = keyResultsFromTeam.map(async (keyResult) => {
      const supportTeam = await this.core.keyResult.getSupportTeam(keyResult.id)
      return supportTeam
    })

    const keyResultSupportTeamIDs = (await Promise.all(keyResultsSupportTeam))
      .flat()
      .map(({ id }) => id)

    const keyResultsFromTeamWithLowConfidence = await this.core.keyResult.getKeyResultsByConfidence(
      teamId,
      ConfidenceTag.LOW,
    )

    const keyResultsFromTeamWithBarrier = await this.core.keyResult.getKeyResultsByConfidence(
      teamId,
      ConfidenceTag.BARRIER,
    )

    const asyncFilter = async (array, predicate) => {
      const results = await Promise.all(array.map((element) => predicate(element)))

      return array.filter((_v, index) => results[index])
    }

    const isOutdatedKeyResults = await asyncFilter(
      keyResultsFromTeam,
      async (keyResult: KeyResult) => {
        const latestCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(
          keyResult.id,
        )

        const isOutdated = latestCheckIn
          ? this.isOutdated(latestCheckIn)
          : differenceInDays(Date.now(), keyResult.createdAt) > 6

        return isOutdated
      },
    )

    const teamUsers = await team.users
    const teamOwner = await this.core.user.getFromID(team.ownerId)

    const allUsersFromTeam = [...teamUsers, teamOwner]

    const noRelatedToOkr = allUsersFromTeam.filter(
      ({ id }) => ![...keyResultOwnersIds, ...keyResultSupportTeamIDs].includes(id),
    )

    return {
      outdated: isOutdatedKeyResults,
      barrier: keyResultsFromTeamWithBarrier,
      low: keyResultsFromTeamWithLowConfidence,
      noRelated: noRelatedToOkr,
    }
  }
}
