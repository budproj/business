import { intersection } from 'lodash'

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

  protected canActivate(
    user: UserWithContext,
    command: Command,
    owns: boolean,
    team: boolean,
    company: boolean,
  ): boolean {
    const requiredPermissions = this.getPermissionsForScopes(command, owns, team, company)
    return intersection(requiredPermissions, user.token.permissions).length > 0
  }

  protected async isTeamLeader(teams: Team[], user: UserWithContext): Promise<boolean> {
    const leaderPromises = teams.map(async (team) =>
      this.core.dispatchCommand<User>('get-team-owner', team),
    )
    const leaders = await Promise.all(leaderPromises)

    return leaders.some((leader) => leader.id === user.id)
  }

  protected async isCompanyMember(company: TeamInterface, user: UserWithContext): Promise<boolean> {
    const userCompanies = await this.core.dispatchCommand<Team[]>('get-user-companies', user)

    return userCompanies.some((userCompany) => userCompany.id === company.id)
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

  public abstract canCreate(
    user: UserWithContext,
    ...indexArguments: string[]
  ): boolean | Promise<boolean>

  public abstract canRead(
    user: UserWithContext,
    ...indexArguments: string[]
  ): boolean | Promise<boolean>

  public abstract canUpdate(
    user: UserWithContext,
    ...indexArguments: string[]
  ): boolean | Promise<boolean>

  public abstract canDelete(
    user: UserWithContext,
    ...indexArguments: string[]
  ): boolean | Promise<boolean>
}
