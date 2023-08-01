import { Injectable } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Injectable()
export class FlagsAccessControl extends AccessControl {
  protected readonly resource = Resource.FLAGS

  constructor(protected core: CorePortsProvider, coreProvider: CoreProvider) {
    super(core, coreProvider.team)
  }

  isTeamOwner(user: UserWithContext, team: Team): boolean {
    return user.id === team.ownerId
  }

  protected async resolveContextScopes(user: UserWithContext, parentTeamID?: string): Promise<AccessControlScopes> {
    const { team, teams } = await this.getTeamRelatedEntities(parentTeamID)

    const isTeamLeader = this.isTeamLeader(teams, user)
    const isCompanyMember = this.isTeamsMember(teams, user)
    const isOwner = team.ownerId === user.id

    return {
      isOwner,
      isTeamLeader,
      isCompanyMember,
    }
  }

  protected async resolveEntityScopes(requestUser: UserWithContext, teamID: string): Promise<AccessControlScopes> {
    const { teams, team } = await this.getTeamRelatedEntities(teamID)

    const isOwner = this.isTeamOwner(requestUser, team)
    const isTeamLeader = this.isTeamLeader([team], requestUser)
    const isCompanyMember = this.isTeamsMember(teams, requestUser)

    return {
      isOwner,
      isTeamLeader,
      isCompanyMember,
    }
  }
}
