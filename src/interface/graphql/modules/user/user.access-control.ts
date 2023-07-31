import { Injectable } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Injectable()
export class UserAccessControl extends AccessControl {
  protected readonly resource = Resource.USER

  constructor(protected core: CorePortsProvider, coreProvider: CoreProvider) {
    super(core, coreProvider.team)
  }

  static isSameUser(userId: string, requestUserId: string): boolean {
    return userId === requestUserId
  }

  public async isInTheSameCompany(user: UserWithContext, userIdFromRequest: string): Promise<boolean> {
    if (UserAccessControl.isSameUser(user?.id, userIdFromRequest)) {
      return true
    }

    const [baseCompanies, requesterCompanies] = await Promise.all([
      this.teamProvider.getUserCompanies(user.id),
      this.teamProvider.getUserCompanies(userIdFromRequest),
    ])

    const baseCompaniesIds = new Set(baseCompanies.map((company) => company.id))

    // Look for all target teams in the base tree
    return requesterCompanies.every(({ id }) => baseCompaniesIds.has(id))
  }

  public isUserTeamLeader(user: UserWithContext): boolean {
    return this.isTeamLeader(user.teams, user)
  }

  protected async resolveContextScopes(user: UserWithContext, teamID: string): Promise<AccessControlScopes> {
    const { team, teams } = await this.getTeamRelatedEntities(teamID)

    const isTeamLeader = this.isTeamLeader(teams, user)
    const isCompanyMember = this.isTeamsMember(teams, user)
    const isOwner = team.ownerId === user.id

    return {
      isOwner,
      isTeamLeader,
      isCompanyMember,
    }
  }

  protected async resolveEntityScopes(requestUser: UserWithContext, userID: string): Promise<AccessControlScopes> {
    const { teams } = await this.getUserRelatedEntities(userID)

    const isSameUser = UserAccessControl.isSameUser(userID, requestUser.id)
    const isTeamLeader = this.isTeamLeader(teams, requestUser)
    const isCompanyMember = this.isTeamsMember(teams, requestUser)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isSameUser,
    }
  }
}
