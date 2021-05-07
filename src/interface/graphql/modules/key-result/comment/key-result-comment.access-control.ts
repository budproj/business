import { Injectable } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { UserWithContext } from '@adapters/context/interfaces/user.interface'
import { Command } from '@adapters/policy/enums/command.enum'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { KeyResultCommentInterface } from '@core/modules/key-result/comment/key-result-comment.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Injectable()
export class KeyResultCommentAccessControl extends AccessControl<KeyResultCommentInterface> {
  protected readonly resource = Resource.KEY_RESULT_COMMENT

  constructor(private readonly core: CorePortsProvider) {
    super()
  }

  public async canCreate(
    user: UserWithContext,
    data: Partial<KeyResultCommentInterface>,
  ): Promise<boolean> {
    const keyResult = await this.core.dispatchCommand<KeyResult>(
      'get-key-result-from-check-in',
      data,
    )
    if (!keyResult) return false

    const teams = await this.core.dispatchCommand<Team[]>('get-key-result-team-tree', keyResult)

    const isKeyResultOwner = await this.isKeyResultOwner(keyResult, user)
    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isCompanyMember(keyResult, user)

    return this.canActivate(user, Command.CREATE, isKeyResultOwner, isTeamLeader, isCompanyMember)
  }

  public async canRead(
    _user: UserWithContext,
    _indexes: Partial<KeyResultCommentInterface>,
  ): Promise<boolean> {
    return false
  }

  public async canUpdate(
    _user: UserWithContext,
    _indexes: Partial<KeyResultCommentInterface>,
  ): Promise<boolean> {
    return false
  }

  public async canDelete(
    _user: UserWithContext,
    _indexes: Partial<KeyResultCommentInterface>,
  ): Promise<boolean> {
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
