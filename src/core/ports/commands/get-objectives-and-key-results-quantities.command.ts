import { Command } from './base.command'

export class GetObjectivesAndKeyResultQuantities extends Command<any> {
  public async execute(user: any): Promise<any> {
    const userCompanies = await this.core.team.getUserCompanies(user)
    const userCompanyIDs = userCompanies.map((company) => company.id)
    const userReachableTeams = await this.core.team.getUserCompaniesTeams(userCompanyIDs)

    const userReachableTeamsIds = userReachableTeams.map((team) => team.id)

    const keyResultsQuantity = await this.core.keyResult.getKeyResultsQuantity(
      userReachableTeamsIds,
    )
    const objectivesQuantity = await this.core.objective.getObjectivesQuantity(
      userReachableTeamsIds,
    )

    const confidences = await this.core.keyResult.getConfidenceKeyResultsQuantity(
      userReachableTeamsIds,
    )

    return {
      keyResultsQuantity,
      objectivesQuantity,
      ...confidences,
    }
  }
}
