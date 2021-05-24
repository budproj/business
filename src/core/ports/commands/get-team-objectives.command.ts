import { GetOptions } from '@core/interfaces/get-options'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'

import { Command } from './base.command'

interface GetTeamObjectivesProperties extends ObjectiveInterface {
  active: boolean
}

type GetObjectivesHandler = (
  objectiveIDs: string[],
  filters?: Partial<ObjectiveInterface>,
  options?: GetOptions<Objective>,
) => Promise<Objective[]>

export class GetTeamObjectivesCommand extends Command<Objective[]> {
  public async execute(
    team: TeamInterface,
    properties: Partial<GetTeamObjectivesProperties>,
    options?: GetOptions<Objective>,
  ): Promise<Objective[]> {
    const objectiveIDs = await this.getObjectiveIDsFromTeam(team)
    const [handler, filters] = this.unmarshalProperties(properties)

    return handler(objectiveIDs, filters, options)
  }

  private async getObjectiveIDsFromTeam(team: TeamInterface): Promise<string[]> {
    const teamKeyResults = await this.core.keyResult.getFromTeams(team)
    if (!teamKeyResults || teamKeyResults.length === 0) return []

    return teamKeyResults.map((keyResult) => keyResult.objectiveId)
  }

  private unmarshalProperties({
    active,
    ...filters
  }: Partial<GetTeamObjectivesProperties>): [GetObjectivesHandler, Partial<ObjectiveInterface>] {
    let handler = async (
      ids: string[],
      indexes: Partial<ObjectiveInterface>,
      options: GetOptions<ObjectiveInterface>,
    ) => this.core.objective.getFromIDList(ids, indexes, options)
    if (typeof active !== 'undefined') {
      handler = active
        ? async (
            ids: string[],
            indexes: Partial<ObjectiveInterface>,
            options: GetOptions<ObjectiveInterface>,
          ) => this.core.objective.getActiveFromIDList(ids, indexes, options)
        : async (
            ids: string[],
            indexes: Partial<ObjectiveInterface>,
            options: GetOptions<ObjectiveInterface>,
          ) => this.core.objective.getNotActiveFromIDList(ids, indexes, options)
    }

    return [handler, filters]
  }
}
