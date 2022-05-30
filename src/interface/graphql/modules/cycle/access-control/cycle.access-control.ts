import { Injectable } from '@nestjs/common'
import { UserInputError } from 'apollo-server-core'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Injectable()
export class CycleAccessControl extends AccessControl {
  protected readonly resource = Resource.CYCLE

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
    user: UserWithContext,
    cycleID: string,
  ): Promise<AccessControlScopes> {
    const cycle = await this.core.dispatchCommand<Cycle>('get-cycle', {
      id: cycleID,
    })
    if (!cycle) throw new UserInputError('We could not find a cycle for your request')

    const team = await this.core.dispatchCommand<Team>('get-team', cycle.team)

    const isTeamLeader = await this.isTeamLeader([team], user)
    const isCompanyMember = await this.isCompanyMember([team], user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: false,
    }
  }
}
