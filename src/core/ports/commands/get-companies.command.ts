import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetCompaniesCommand extends Command<Team[]> {
  public async execute(): Promise<Team[]> {
    const companies = await this.core.team.getAllCompanies()
    return companies
  }
}
