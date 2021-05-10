import { Injectable } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { Command } from '@adapters/policy/enums/command.enum'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Injectable()
export class KeyResultCheckInAccessControl extends AccessControl {
  protected readonly resource = Resource.KEY_RESULT_CHECK_IN

  constructor(private readonly core: CorePortsProvider) {
    super()
  }

  public async canCreate(user: UserWithContext, keyResultID: string): Promise<boolean> {
    const keyResult = await this.core.dispatchCommand<KeyResult>('get-key-result', {
      id: keyResultID,
    })
    if (!keyResult) return false

    const teams = await this.core.dispatchCommand<Team[]>('get-key-result-team-tree', keyResult)

    const isKeyResultOwner = await this.isKeyResultOwner(keyResult, user)
    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isCompanyMember(keyResult, user)

    return this.canActivate(user, Command.CREATE, isKeyResultOwner, isTeamLeader, isCompanyMember)
  }

  public async canRead(_user: UserWithContext, _id: string): Promise<boolean> {
    return true
  }

  public async canUpdate(_user: UserWithContext, _id: string): Promise<boolean> {
    return false
  }

  public async canDelete(_user: UserWithContext, _id: string): Promise<boolean> {
    return false
  }

  private async isKeyResultOwner(keyResult: KeyResult, user: UserWithContext): Promise<boolean> {
    const owner = await this.core.dispatchCommand<User>('get-key-result-owner', keyResult)

    return owner.id === user.id
  }

  private async isTeamLeader(teams: Team[], user: UserWithContext): Promise<boolean> {
    const leaderPromises = teams.map(async (team) =>
      this.core.dispatchCommand<User>('get-team-owner', team),
    )
    const leaders = await Promise.all(leaderPromises)

    return leaders.some((leader) => leader.id === user.id)
  }

  private async isCompanyMember(keyResult: KeyResult, user: UserWithContext): Promise<boolean> {
    const keyResultCompany = await this.core.dispatchCommand<Team>(
      'get-key-result-company',
      keyResult,
    )
    const userCompanies = await this.core.dispatchCommand<Team[]>('get-user-companies', user)

    return userCompanies.some((company) => company.id === keyResultCompany.id)
  }
}
