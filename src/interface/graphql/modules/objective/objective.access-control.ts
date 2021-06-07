import { Injectable, NotImplementedException } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Injectable()
export class ObjectiveAccessControl extends AccessControl {
  protected readonly resource = Resource.OBJECTIVE

  constructor(protected core: CorePortsProvider) {
    super(core)
  }

  protected async resolveContextScopes(
    user: UserWithContext,
    teamID: string,
  ): Promise<AccessControlScopes> {
    const teams = await this.core.dispatchCommand<Team[]>('get-team-tree', { id: teamID })

    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isCompanyMember(teams, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isTeamLeader,
    }
  }

  protected async resolveEntityScopes(
    _user: UserWithContext,
    _objectiveID: string,
  ): Promise<AccessControlScopes> {
    throw new NotImplementedException(
      'The objective entity permission scope is not implemented yet',
    )
  }
}
