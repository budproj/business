import { UserInterface } from '@core/modules/user/user.interface'

import { Command } from './base.command'

/**
 * @deprecated prefer using the `OverviewProvider` instead
 */
export class GetObjectivesAndKeyResultQuantities extends Command<any> {
  public async execute(user: UserInterface): Promise<any> {
    const userCompanies = await this.core.team.getUserCompanies(user)
    const userCompanyIDs = userCompanies.map((company) => company.id)
    const userReachableTeams = await this.core.team.getDescendantsByIds(userCompanyIDs)

    const userReachableTeamsIds = userReachableTeams.map((team) => team.id)

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
