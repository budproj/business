import { Injectable } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/interfaces/access-control.interface'
import { UserWithContext } from '@adapters/context/interfaces/user.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Injectable()
export class KeyResultCheckInAccessControl implements AccessControl<KeyResultCheckInInterface> {
  constructor(private readonly core: CorePortsProvider) {}

  public async canCreate(
    user: UserWithContext,
    data: Partial<KeyResultCheckInInterface>,
  ): Promise<boolean> {
    const keyResult = await this.core.getKeyResultFromCheckIn.execute(data)
    if (!keyResult) return false

    const teams = await this.core.getKeyResulTeamTree.execute(keyResult)

    const isKeyResultOwner = await this.isKeyResultOwner(keyResult, user)
    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isCompanyMember(keyResult, user)

    console.log(isKeyResultOwner, isTeamLeader, isCompanyMember)

    return false
  }

  public async canRead(
    _user: UserWithContext,
    _indexes: Partial<KeyResultCheckInInterface>,
  ): Promise<boolean> {
    return false
  }

  public async canUpdate(
    _user: UserWithContext,
    _indexes: Partial<KeyResultCheckInInterface>,
  ): Promise<boolean> {
    return false
  }

  public async canDelete(
    _user: UserWithContext,
    _indexes: Partial<KeyResultCheckInInterface>,
  ): Promise<boolean> {
    return false
  }

  private async isKeyResultOwner(keyResult: KeyResult, user: UserWithContext): Promise<boolean> {
    const owner = await this.core.getKeyResultOwner.execute(keyResult)

    return owner.id === user.id
  }

  private async isTeamLeader(teams: Team[], user: UserWithContext): Promise<boolean> {
    const leaderPromises = teams.map(async (team) => this.core.getTeamOwner.execute(team))
    const leaders = await Promise.all(leaderPromises)

    return leaders.some((leader) => leader.id === user.id)
  }

  private async isCompanyMember(keyResult: KeyResult, user: UserWithContext): Promise<boolean> {
    const keyResultCompany = await this.core.getKeyResultCompany.execute(keyResult)
    const userCompanies = await this.core.getUserCompanies.execute(user)

    return userCompanies.some((company) => company.id === keyResultCompany.id)
  }
}
