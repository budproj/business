import { Injectable } from '@nestjs/common'

import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { TeamProvider } from '@core/modules/team/team.provider'

import { Port } from './base.interface'

@Injectable()
export class GetKeyResultTeamTreePort implements Port<Promise<Team[]>> {
  constructor(private readonly team: TeamProvider) {}

  public async execute(keyResult: Partial<KeyResultInterface>): Promise<Team[]> {
    const keyResultTeamIndexes = { id: keyResult.teamId }
    const keyResultTeam = await this.team.getFromIndexes(keyResultTeamIndexes)

    const teamTree = await this.team.getTeamNodesTreeBeforeTeam(keyResultTeam)

    return teamTree
  }
}
