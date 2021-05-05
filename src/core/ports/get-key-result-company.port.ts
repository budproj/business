import { Injectable } from '@nestjs/common'

import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { TeamProvider } from '@core/modules/team/team.provider'

import { Port } from './base.interface'

@Injectable()
export class GetKeyResultCompanyPort implements Port<Promise<Team>> {
  constructor(private readonly team: TeamProvider) {}

  public async execute(keyResult: KeyResult): Promise<Team> {
    const company = await this.team.getRootTeamForTeam({ id: keyResult.teamId })

    return company
  }
}
