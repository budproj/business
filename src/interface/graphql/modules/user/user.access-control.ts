import { Injectable } from '@nestjs/common'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

type EntityRelatedEntities = {
  user: User
  teams: Team[]
  companies: Team[]
}

type ContextRelatedEntities = {
  team: Team
  teams: Team[]
  company: Team
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

  public async isInTheSameCompany(user: UserWithContext, userIdFromRequest: string) {
    const partialUser: Partial<User> = { id: userIdFromRequest }

    const userCompanies = await this.core.dispatchCommand<Team[]>('get-user-companies', user)
    const userFromRequestCompanies = await this.core.dispatchCommand<Team[]>(
      'get-user-companies',
      partialUser,
    )

    const userFromRequestCompaniesIds = new Set(
      userFromRequestCompanies.map((company) => company.id),
    )
    return userCompanies
      .map((company) => company.id)
      .some((company) => {
        return userFromRequestCompaniesIds.has(company)
      })
  }

  protected async resolveContextScopes(
    user: UserWithContext,
    teamID: string,
  ): Promise<AccessControlScopes> {
    const { team, teams, company } = await this.getContextRelatedEntities(teamID)

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
    userID: string,
  ): Promise<AccessControlScopes> {
    const { user, teams, companies } = await this.getEntityRelatedEntities(userID)

    const isSameUser = UserAccessControl.isSameUser(user, requestUser)
    const isTeamLeader = await this.isTeamLeader(teams, requestUser)
    const isCompanyMember = await this.isCompanyMember(companies, requestUser)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isSameUser,
    }
  }

  private async getEntityRelatedEntities(userID: string): Promise<EntityRelatedEntities> {
    const user = await this.core.dispatchCommand<User>('get-user', { id: userID })
    const teams = await this.core.dispatchCommand<Team[]>('get-user-team-tree', user)
    const companies = await this.core.dispatchCommand<Team[]>('get-user-companies', user)

    return {
      user,
      teams,
      companies,
    }
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
