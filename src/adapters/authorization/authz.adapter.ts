import { uniq, zipObject } from 'lodash'

import { SCOPE_PRIORITY } from './authorization.constants'
import { Command } from './enums/command.enum'
import { Effect } from './enums/effect.enum'
import { Resource } from './enums/resource.enum'
import { Scope } from './enums/scope.enum'
import { AuthorizationUser } from './interfaces/user.interface'
import { Action } from './types/action.type'
import { CommandPolicy } from './types/command-policy.type'
import { Permission } from './types/permission.type'
import { ResourcePolicy } from './types/resource-policy.type'
import { ScopePolicy } from './types/scope-policy'

export class AuthzAdapter {
  private readonly resources = [
    Resource.PERMISSION,
    Resource.USER,
    Resource.TEAM,
    Resource.CYCLE,
    Resource.OBJECTIVE,
    Resource.KEY_RESULT,
    Resource.KEY_RESULT_CHECK_IN,
    Resource.KEY_RESULT_COMMENT,
  ]

  public getResourcePoliciesFromPermissions(
    permissions: Permission[],
    resources: Resource[] = this.resources,
  ): ResourcePolicy {
    const commandPolicies = resources.map((resource) =>
      this.getCommandPoliciesForResourceFromPermissions(resource, permissions),
    )
    const resourcePolicies = zipObject<Resource, CommandPolicy>(resources, commandPolicies)

    return resourcePolicies
  }

  public canUserExecuteActions(user: AuthorizationUser, actions?: Action[]): boolean {
    if (!actions || actions.length === 0) return true

    const userAllowedActions = this.getActionsFromPermissions(user.token.permissions)
    if (userAllowedActions.length === 0) return false

    const canExecuteAllRequiredActions = actions.every((action) =>
      userAllowedActions.includes(action),
    )

    return canExecuteAllRequiredActions
  }

  public getResourceCommandScopeForUser(
    resource: Resource,
    command: Command,
    user: AuthorizationUser,
  ): Scope {
    const action = this.buildAction(resource, command)
    const scope = this.getHighestScopeForActionFromUser(action, user)

    return scope
  }

  private getCommandPoliciesForResourceFromPermissions(
    resource: Resource,
    permissions: Permission[],
  ): CommandPolicy {
    const commands = [Command.CREATE, Command.READ, Command.UPDATE, Command.DELETE]
    const scopePolicies = commands.map((command) =>
      this.getScopePoliciesForResourceCommandFromPermissions(resource, command, permissions),
    )

    const commandPolicies = zipObject<Command, ScopePolicy>(commands, scopePolicies)

    return commandPolicies
  }

  private getScopePoliciesForResourceCommandFromPermissions(
    resource: Resource,
    command: Command,
    permissions: Permission[],
  ): ScopePolicy {
    const action: Action = `${resource}:${command}` as const
    const actionPermissions = this.filterActionPermissionsFromPermissions(action, permissions)
    const scopes = [Scope.ANY, Scope.COMPANY, Scope.TEAM, Scope.OWNS]
    const effectPolicies = scopes.map((scope) =>
      this.getEffectPolicyForActionScopeFromPermissions(scope, action, actionPermissions),
    )

    const scopePolicies = zipObject<Scope, Effect>(scopes, effectPolicies)

    return scopePolicies
  }

  private getEffectPolicyForActionScopeFromPermissions(
    scope: Scope,
    action: Action,
    permissions: Permission[],
  ): Effect {
    const expectedPermission = `${action}:${scope}`
    const hasPermission = permissions.some((permission) => permission.includes(expectedPermission))

    return hasPermission ? Effect.ALLOW : Effect.DENY
  }

  private filterActionPermissionsFromPermissions(action: Action, permissions: Permission[]) {
    return permissions.filter((permission) => permission.includes(action))
  }

  private getActionsFromPermissions(permissions: Permission[]): Action[] {
    const actions: Action[] = permissions.map((permission) => this.drillUp<Action>(permission))
    const uniqActions = uniq(actions)

    return uniqActions
  }

  private drillUp<T extends string = string>(value: string): T {
    return value.split(':').slice(0, -1).join(':') as T
  }

  private buildAction(resource: Resource, command: Command): Action {
    return `${resource}:${command}` as const
  }

  private getHighestScopeForActionFromUser(
    action: Action,
    user: AuthorizationUser,
  ): Scope | undefined {
    const highestScope = SCOPE_PRIORITY.find((scope) => {
      const permission = this.buildPermissionFromAction(action, scope)

      return this.userHasPermission(user, permission)
    })

    return highestScope
  }

  private userHasPermission(user: AuthorizationUser, permission: Permission): boolean {
    return user.token.permissions.includes(permission)
  }

  private buildPermissionFromAction(action: Action, scope: Scope): Permission {
    return `${action}:${scope}` as const
  }
}
