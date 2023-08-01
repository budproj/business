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
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

export abstract class AccessControl {
  protected readonly resource!: Resource
  private readonly policyAdapter: PolicyAdapter = new PolicyAdapter()

  protected constructor(protected readonly core: CorePortsProvider) {}

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

  protected async isTeamLeader(teams: Team[], user: UserWithContext): Promise<boolean> {
    const leaderPromises = teams.map(async (team) =>
      this.core.dispatchCommand<User>('get-team-owner', team),
    )
    const leaders = await Promise.all(leaderPromises)

    return leaders.some((leader) => leader.id === user.id)
  }

  protected async isCompanyMember(
    companies: TeamInterface[],
    user: UserWithContext,
  ): Promise<boolean> {
    const userCompanies = await this.core.dispatchCommand<Team[]>('get-user-companies', user)

    return userCompanies.some((userCompany) =>
      companies.some((company) => userCompany.id === company.id),
    )
  }

  private async resolveContextCommandPermission(
    command: Command,
    user: UserWithContext,
    ...indexArguments: string[]
  ): Promise<boolean> {
    const { isOwner, isTeamLeader, isCompanyMember } = await this.resolveContextScopes(
      user,
      ...indexArguments,
    )

    return this.canActivate(user, command, isOwner, isTeamLeader, isCompanyMember)
  }

  private async resolveEntityCommandPermission(
    command: Command,
    user: UserWithContext,
    ...indexArguments: string[]
  ): Promise<boolean> {
    const { isOwner, isTeamLeader, isCompanyMember } = await this.resolveEntityScopes(
      user,
      ...indexArguments,
    )

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

  private getPermissionsForScopes(
    command: Command,
    owns: boolean,
    team: boolean,
    company: boolean,
  ): Permission[] {
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
