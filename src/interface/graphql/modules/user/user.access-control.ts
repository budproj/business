import { Injectable } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

type RelatedEntities = {
  user: User
  teams: Team[]
  companies: Team[]
}

@Injectable()
export class UserAccessControl extends AccessControl {
  protected readonly resource = Resource.USER

  constructor(protected core: CorePortsProvider) {
    super(core)
  }

  static isSameUser(user: User, requestUser: UserWithContext): boolean {
    return user.id === requestUser.id
  }

  protected async resolveContextScopes(
    _user: UserWithContext,
    _teamID: string,
  ): Promise<AccessControlScopes> {
    return {
      isOwner: false,
      isTeamLeader: false,
      isCompanyMember: false,
    }
  }

  protected async resolveEntityScopes(
    requestUser: UserWithContext,
    userID: string,
  ): Promise<AccessControlScopes> {
    const { user, teams, companies } = await this.getRelatedEntities(userID)

    const isSameUser = UserAccessControl.isSameUser(user, requestUser)
    const isTeamLeader = await this.isTeamLeader(teams, requestUser)
    const isCompanyMember = await this.isCompanyMember(companies, requestUser)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isSameUser,
    }
  }

  private async getRelatedEntities(userID: string): Promise<RelatedEntities> {
    const user = await this.core.dispatchCommand<User>('get-user', { id: userID })
    const teams = await this.core.dispatchCommand<Team[]>('get-user-team-tree', user)
    const companies = await this.core.dispatchCommand<Team[]>('get-user-companies', user)

    return {
      user,
      teams,
      companies,
    }
  }
}
