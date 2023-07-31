import { intersection } from 'lodash'

import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Command } from '@adapters/policy/enums/command.enum'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { Scope } from '@adapters/policy/enums/scope.enum'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { Permission } from '@adapters/policy/types/permission.type'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { TeamProvider } from '@core/modules/team/team.provider'
import { CorePortsProvider } from '@core/ports/ports.provider'

type TeamRelatedEntities = {
  team: Team
  teams: Team[]
  company: Team
}

type UserRelatedEntities = {
  teams: Team[]
  companies: Team[]
}

export abstract class AccessControl {
  protected readonly resource!: Resource
  private readonly policyAdapter: PolicyAdapter = new PolicyAdapter()

  protected constructor(protected readonly core: CorePortsProvider, protected teamProvider: TeamProvider) {}

  public async canCreate(user: UserWithContext, ...indexArguments: string[]): Promise<boolean> {
    return this.resolveContextCommandPermission(Command.CREATE, user, ...indexArguments)
  }

  public async canRead(user: UserWithContext, ...indexArguments: string[]): Promise<boolean> {
    return this.resolveEntityCommandPermission(Command.READ, user, ...indexArguments)
  }

  public async canUpdate(user: UserWithContext, ...indexArguments: string[]): Promise<boolean> {
    return this.resolveEntityCommandPermission(Command.UPDATE, user, ...indexArguments)
  }

  public async canDelete(user: UserWithContext, ...indexArguments: string[]): Promise<boolean> {
    return this.resolveEntityCommandPermission(Command.DELETE, user, ...indexArguments)
  }

  protected isTeamLeader(teams: Array<Team | TeamInterface>, user: UserWithContext): boolean {
    return teams.some((team) => team.ownerId === user.id)
  }

  protected isTeamsMember(teams: Team[], user: UserWithContext): boolean {
    const teamsIds = new Set(teams.map((team) => team.id))
    return user.teams.some((team) => teamsIds.has(team.id))
  }

  /**
   * @deprecated
   */
  protected async isCompanyMember(companies: TeamInterface[], user: UserWithContext): Promise<boolean> {
    const userCompanies = await this.core.dispatchCommand<Team[]>('get-user-companies', user)

    return userCompanies.some((userCompany) => companies.some((company) => userCompany.id === company.id))
  }

  protected async getTeamRelatedEntities(teamId: string): Promise<TeamRelatedEntities> {
    const teams = await this.teamProvider.getAscendantsByIds([teamId], {
      includeOriginTeams: true,
      rootsOnly: false,
    })

    const team = teams.find((team) => team.id === teamId)
    const company = teams.find((team) => !team.parentId && team.parentId && team.id)

    return {
      team,
      teams,
      company,
    }
  }

  protected async getUserRelatedEntities(userId: string): Promise<UserRelatedEntities> {
    const teams = await this.teamProvider.getUserCompaniesAndDepartments(userId)

    const companies = teams.filter((team) => !team.parentId && team.parentId && team.id)

    return {
      teams,
      companies,
    }
  }

  private async resolveContextCommandPermission(
    command: Command,
    user: UserWithContext,
    ...indexArguments: string[]
  ): Promise<boolean> {
    const { isOwner, isTeamLeader, isCompanyMember } = await this.resolveContextScopes(user, ...indexArguments)

    return this.canActivate(user, command, isOwner, isTeamLeader, isCompanyMember)
  }

  private async resolveEntityCommandPermission(
    command: Command,
    user: UserWithContext,
    ...indexArguments: string[]
  ): Promise<boolean> {
    const { isOwner, isTeamLeader, isCompanyMember } = await this.resolveEntityScopes(user, ...indexArguments)

    return this.canActivate(user, command, isOwner, isTeamLeader, isCompanyMember)
  }

  private canActivate(
    user: UserWithContext,
    command: Command,
    owns: boolean,
    team: boolean,
    company: boolean,
  ): boolean {
    const requiredPermissions = this.getPermissionsForScopes(command, owns, team, company)
    return intersection(requiredPermissions, user.token.permissions).length > 0
  }

  private getPermissionsForScopes(command: Command, owns: boolean, team: boolean, company: boolean): Permission[] {
    const permissions = [
      owns && this.policyAdapter.buildPermission(this.resource, command, Scope.OWNS),
      team && this.policyAdapter.buildPermission(this.resource, command, Scope.TEAM),
      company && this.policyAdapter.buildPermission(this.resource, command, Scope.COMPANY),
      this.policyAdapter.buildPermission(this.resource, command, Scope.ANY),
    ].filter((permission) => Boolean(permission))

    return permissions as Permission[]
  }

  protected abstract resolveContextScopes(
    user: UserWithContext,
    ...indexArguments: string[]
  ): Promise<AccessControlScopes>

  protected abstract resolveEntityScopes(
    user: UserWithContext,
    ...indexArguments: string[]
  ): Promise<AccessControlScopes>
}
