import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetUsersWithIndividualOkr extends Command<User[]> {
  public async execute(user: User): Promise<User[]> {
    const teamsIds = (await this.core.team.getUserCompaniesAndDepartments(user.id)).map((company) => company.id)

    return this.core.user.getUsersWithActiveObjectives(teamsIds)
  }
}
