import { Injectable } from '@nestjs/common'
import { UserInputError } from 'apollo-server-core'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Injectable()
export class CycleAccessControl extends AccessControl {
  protected readonly resource = Resource.CYCLE

  constructor(protected core: CorePortsProvider, coreProvider: CoreProvider) {
    super(core, coreProvider.team)
  }

  protected async resolveContextScopes(user: UserWithContext, teamID: string): Promise<AccessControlScopes> {
    const teams = await this.teamProvider.getAscendantsByIds([teamID], {
      includeOriginTeams: true,
      rootsOnly: false,
    })

    const isTeamLeader = this.isTeamLeader(teams, user)
    const isCompanyMember = this.isTeamsMember(teams, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isTeamLeader,
    }
  }

  protected async resolveEntityScopes(user: UserWithContext, cycleID: string): Promise<AccessControlScopes> {
    const cycle = await this.core.dispatchCommand<Cycle>('get-cycle', {
      id: cycleID,
    })
    if (!cycle) throw new UserInputError('We could not find a cycle for your request')

    const teams = await this.teamProvider.getAscendantsByIds([cycle.teamId], {
      includeOriginTeams: true,
      rootsOnly: false,
    })

    const team = teams.find(({ id }) => id === cycle.teamId)

    const isTeamLeader = this.isTeamLeader([team], user)
    const isCompanyMember = this.isTeamsMember(teams, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: false,
    }
  }
}
