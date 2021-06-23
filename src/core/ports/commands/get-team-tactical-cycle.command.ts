import { sortBy } from 'lodash'

import { Cycle } from '@core/modules/cycle/cycle.orm-entity'

import { Command } from './base.command'

export class GetTeamTacticalCycleCommand extends Command<Cycle | undefined> {
  public async execute(teamID: string): Promise<Cycle | undefined> {
    const teamCycles = await this.core.cycle.getFromTeamsWithFilters({ id: teamID })
    if (teamCycles.length === 0) return

    const sortedCycles = sortBy(teamCycles, 'dateStart').reverse()

    return sortedCycles[0]
  }
}
