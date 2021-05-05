import { Injectable } from '@nestjs/common'

import { Team } from '@core/modules/team/team.orm-entity'
import { TeamProvider } from '@core/modules/team/team.provider'
import { User } from '@core/modules/user/user.orm-entity'

import { Port } from './base.interface'

@Injectable()
export class GetUserCompaniesPort implements Port<Promise<Team[]>> {
  constructor(private readonly team: TeamProvider) {}

  public async execute(user: User): Promise<Team[]> {
    const companies = await this.team.getUserCompanies(user)

    return companies
  }
}
