import { uniq } from 'lodash'

import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetObjectiveTeamTreeCommand extends Command<Team[]> {
  public async execute(objective: Partial<ObjectiveInterface>): Promise<Team[]> {
    const keyResults = await this.core.keyResult.getFromObjective({ id: objective.id })
    const teamIndexes = keyResults.map((keyResult) => ({
      id: keyResult.teamId,
    }))
    const uniqueTeamIndexes = uniq(teamIndexes)

    return this.core.team.getTeamNodesTreeBeforeTeam(uniqueTeamIndexes)
  }
}
