import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetUserCompaniesCommand extends Command<Team[]> {
  public async execute(user: User): Promise<Team[]> {
    const companies = await this.core.team.getUserCompanies(user)

    return companies
  }
}
