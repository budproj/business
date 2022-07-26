import { Injectable } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

type ContextRelatedEntities = {
  team: Team
  teams: Team[]
  company: Team
}

@Injectable()
export class TeamAccessControl extends AccessControl {
  protected readonly resource = Resource.TEAM

  constructor(protected core: CorePortsProvider) {
    super(core)
  }

  isSameUser(user: UserWithContext, team: Team): boolean {
    return user.id === team.ownerId
  }

  protected async resolveContextScopes(
    user: UserWithContext,
    parentTeamID?: string,
  ): Promise<AccessControlScopes> {
    const { team, teams, company } = await this.getContextRelatedEntities(parentTeamID)

    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isCompanyMember([company], user)
    const isOwner = team.ownerId === user.id

    return {
      isOwner,
      isTeamLeader,
      isCompanyMember,
    }
  }

  protected async resolveEntityScopes(
    requestUser: UserWithContext,
    teamID: string,
  ): Promise<AccessControlScopes> {
    const team = await this.core.dispatchCommand<Team>('get-team', { id: teamID })

    const { companies } = await this.getEntityRelatedEntities(requestUser.id)

    const isOwner = this.isSameUser(requestUser, team)
    const isTeamLeader = await this.isTeamLeader([team], requestUser)
    const isCompanyMember = await this.isCompanyMember(companies, requestUser)

    return {
      isOwner,
      isTeamLeader,
      isCompanyMember,
    }
  }

  private async getEntityRelatedEntities(userID: string) {
    const user = await this.core.dispatchCommand<User>('get-user', { id: userID })

    const companies = await this.core.dispatchCommand<Team[]>('get-user-companies', user)

    return { companies }
  }

  private async getContextRelatedEntities(teamID: string): Promise<ContextRelatedEntities> {
    const teamIndexes = { id: teamID }

    const team = await this.core.dispatchCommand<Team>('get-team', teamIndexes)
    const teams = await this.core.dispatchCommand<Team[]>('get-team-tree', teamIndexes)
    const company = await this.core.dispatchCommand<Team>('get-team-company', team)

    return {
      team,
      teams,
      company,
    }
  }
}
