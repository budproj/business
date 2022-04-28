import { Command } from './base.command'

export class GetObjectivesAndKeyResultQuantities extends Command<any> {
  public async execute(user: any): Promise<any> {
    const userCompanies = await this.core.team.getUserCompanies(user)
    const userCompanyIDs = userCompanies.map((company) => company.id)
    const userReachableTeams = await this.core.team.getUserCompaniesTeams(userCompanyIDs)

    const userReachableTeamsIds = userReachableTeams.map((team) => team.id)
    const teste = await this.core.keyResult.getKeyResults(
      userReachableTeamsIds,
      undefined,
      undefined,
      true,
      100,
    )

    console.log(
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    )

    console.log(teste)
    console.log(teste.length)

    const keyResultsQuantityPromise =
      this.core.keyResult.getActiveKeyResultsQuantity(userReachableTeamsIds)
    const objectivesQuantityPromise =
      this.core.objective.getObjectivesQuantity(userReachableTeamsIds)
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
