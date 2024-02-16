import { KeyResultProvider } from '@core/modules/key-result/key-result.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { Command } from './base.command'

export class GetObjectivesAndKeyResultQuantities extends Command<any> {
  public async execute(user: UserInterface, teamId?: TeamInterface['id']): Promise<any> {
    let userReachableTeamsIds: Array<TeamInterface['id']> = []

    if (teamId) {
      const userReachableTeams = await this.core.team.getDescendantsByIds([teamId])
      userReachableTeamsIds = userReachableTeams.map((team) => team.id)
    } else {
      const userCompanies = await this.core.team.getUserCompanies(user)
      const userCompanyIDs = userCompanies.map((company) => company.id)
      const userReachableTeams = await this.core.team.getDescendantsByIds(userCompanyIDs)
      userReachableTeamsIds = userReachableTeams.map((team) => team.id)
    }

    const keyResultsQuantityPromise =
      this.core.keyResult.getActiveKeyResultsQuantity(userReachableTeamsIds)
    const objectivesQuantityPromise =
      this.core.objective.getActiveObjectivesQuantity(userReachableTeamsIds)
    const confidencesPromise =
      this.core.keyResult.getActiveConfidenceKeyResultsQuantity(userReachableTeamsIds)

    const [keyResultsQuantity, objectivesQuantity, confidences] = await Promise.all([
      keyResultsQuantityPromise,
      objectivesQuantityPromise,
      confidencesPromise,
    ])

    return {
      keyResultsQuantity,
      objectivesQuantity,
      ...confidences,
    }
  }
}
