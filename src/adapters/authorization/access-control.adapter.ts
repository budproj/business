import { intersection } from 'lodash'

import { Command } from '@adapters/policy/enums/command.enum'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { Scope } from '@adapters/policy/enums/scope.enum'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { Permission } from '@adapters/policy/types/permission.type'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'

export abstract class AccessControl {
  protected readonly resource!: Resource
  private readonly policy: PolicyAdapter = new PolicyAdapter()

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

  private getPermissionsForScopes(
    command: Command,
    owns: boolean,
    team: boolean,
    company: boolean,
  ): Permission[] {
    const permissions = [
      owns && this.policy.buildPermission(this.resource, command, Scope.OWNS),
      team && this.policy.buildPermission(this.resource, command, Scope.TEAM),
      company && this.policy.buildPermission(this.resource, command, Scope.COMPANY),
      this.policy.buildPermission(this.resource, command, Scope.ANY),
    ].filter((permission) => Boolean(permission))

    return permissions as Permission[]
  }

  public abstract canCreate(user: UserWithContext, id: string): boolean | Promise<boolean>
  public abstract canRead(user: UserWithContext, id: string): boolean | Promise<boolean>
  public abstract canUpdate(user: UserWithContext, id: string): boolean | Promise<boolean>
  public abstract canDelete(user: UserWithContext, id: string): boolean | Promise<boolean>
}
