import { differenceInDays } from 'date-fns'
import { flatten } from 'lodash'
import { Any } from 'typeorm'

import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserStatus } from '@core/modules/user/enums/user-status.enum'

import { BaseStatusCommand } from './base-status.command'

export class GetTeamFlagsCommand extends BaseStatusCommand {
  public async execute(teamId: TeamInterface['id']): Promise<any> {
    const keyResultsFromTeam = await this.core.keyResult.getKeyResults([teamId])
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

    const keyResultSupportTeamIDs = (await Promise.all(keyResultsSupportTeam)).flat().map(({ id }) => id)

    const keyResultsFromTeamWithLowConfidence = await this.core.keyResult.getKeyResults(
      [teamId],
      undefined,
      undefined,
      true,
      ConfidenceTag.LOW,
    )

    const keyResultsFromTeamWithBarrier = await this.core.keyResult.getKeyResults(
      [teamId],
      undefined,
      undefined,
      true,
      ConfidenceTag.BARRIER,
    )

    const asyncFilter = async (array, predicate) => {
      const results = await Promise.all(array.map((element) => predicate(element)))

      return array.filter((_v, index) => results[index])
    }

    const isOutdatedKeyResults = await asyncFilter(keyResultsFromTeam, async (keyResult: KeyResult) => {
      const latestCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(keyResult.id)

      const isOutdated = latestCheckIn
        ? this.isOutdated(latestCheckIn, new Date())
        : differenceInDays(Date.now(), keyResult.createdAt) > 6

      return isOutdated
    })

    const teamUsers = await this.core.user.getMany(selector)
    const teamOwnerId = (await this.core.team.getOne({ id: teamId })).ownerId
    const teamOwner = await this.core.user.getFromID(teamOwnerId)

    const uniqueUsers = teamUsers.filter((user) => teamOwner?.id !== user.id)

    const allUsersFromTeam = [...uniqueUsers, teamOwner].filter((user) => user.status === UserStatus.ACTIVE)

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
