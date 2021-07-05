import { uniq } from 'lodash'

import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { CommandFactory } from '@core/ports/commands/command.factory'

import { Command } from './base.command'

export class GetObjectiveSupportTeamsCommand extends Command<Team[]> {
  private readonly getTeam: (indexes: Partial<TeamInterface>) => Promise<Team>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getTeam = this.factory.buildCommand<Team>('get-team').execute
  }

  public async execute(objectiveID: string): Promise<Team[]> {
    const keyResults = await this.core.keyResult.getFromObjective({ id: objectiveID })
    const objectiveUniqueTeamsIDs = uniq(keyResults.map((keyResult) => keyResult.teamId))
    const teamPromises = objectiveUniqueTeamsIDs.map(async (id) => this.getTeam({ id }))

    return Promise.all(teamPromises)
  }
}
