import { sortBy } from 'lodash'

import { Cycle } from '@core/modules/cycle/cycle.orm-entity'

import { Command } from './base.command'

type GetTeamTacticalCycleOptions = {
  searchAncestors?: boolean
}

export class GetTeamTacticalCycleCommand extends Command<Cycle | undefined> {
  private readonly defaultOptions: GetTeamTacticalCycleOptions = {
    searchAncestors: true,
  }

  static getClosestCycle(cycles: Cycle[]): Cycle {
    const sortedCycles = sortBy(cycles, 'dateStart').reverse()

    return sortedCycles[0]
  }

  public async execute(
    teamID: string,
    options: GetTeamTacticalCycleOptions = this.defaultOptions,
  ): Promise<Cycle | undefined> {
    const teamCycles = await this.core.cycle.getFromTeamsWithFilters({ id: teamID })
    const teamHasCycles = teamCycles.length > 0

    return teamHasCycles
      ? GetTeamTacticalCycleCommand.getClosestCycle(teamCycles)
      : this.handleMissingCycles(teamID, options)
  }

  private async handleMissingCycles(
    teamID: string,
    options: GetTeamTacticalCycleOptions,
  ): Promise<Cycle | undefined> {
    if (!options.searchAncestors) return

    const team = await this.core.team.getFromID(teamID)
    if (!team || !team.parentId) return

    return this.execute(team.parentId, options)
  }
}
