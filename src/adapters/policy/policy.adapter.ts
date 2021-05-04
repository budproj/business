import { mapValues, uniq, zipObject } from 'lodash'

import { AuthorizationUser } from '../authorization/interfaces/user.interface'

import { Command } from './enums/command.enum'
import { Effect } from './enums/effect.enum'
import { Resource } from './enums/resource.enum'
import { Scope } from './enums/scope.enum'
import { SCOPE_PRIORITY } from './policy.constants'
import { Action } from './types/action.type'
import { CommandPolicy } from './types/command-policy.type'
import { CommandStatement } from './types/command-statement.type'
import { Permission } from './types/permission.type'
import { ResourcePolicy } from './types/resource-policy.type'
import { ResourceStatement } from './types/resource-statement.type copy'
import { ScopePolicy } from './types/scope-policy'

export class PolicyAdapter {
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

  public getResourcePolicyFromPermissions(
    permissions: Permission[],
    resources: Resource[] = this.resources,
  ): ResourcePolicy {
    const commandPolicies = resources.map((resource) =>
      this.getCommandPoliciesForResourceFromPermissions(resource, permissions),
    )
    const resourcePolicy = zipObject<Resource, CommandPolicy>(resources, commandPolicies)

    return resourcePolicy
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

  public getResourcesCommandStatementsForScopeFromPolicy(
    policy: ResourcePolicy,
    scope: Scope,
  ): ResourceStatement<CommandStatement> {
    return mapValues(policy, (commandPolicy) =>
      this.getCommandStatementsForScopeFromPolicy(commandPolicy, scope),
    )
  }

  public denyCommandStatement(statement: CommandStatement): CommandStatement {
    return mapValues(statement, () => Effect.DENY)
  }

  public commandStatementIsDenyingAll(statement: CommandStatement): boolean {
    const effects = uniq(Object.values(statement))

    return effects === [Effect.DENY]
  }

  private getCommandPoliciesForResourceFromPermissions(
    resource: Resource,
    permissions: Permission[],
  ): CommandPolicy {
    const commands = [Command.CREATE, Command.READ, Command.UPDATE, Command.DELETE]
    const scopePolicies = commands.map((command) =>
      this.getScopePoliciesForResourceCommandFromPermissions(resource, command, permissions),
    )

    const commandPolicy = zipObject<Command, ScopePolicy>(commands, scopePolicies)

    return commandPolicy
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

    const scopePolicy = zipObject<Scope, Effect>(scopes, effectPolicies)

    return scopePolicy
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

  private getCommandStatementsForScopeFromPolicy(
    policy: CommandPolicy,
    scope: Scope,
  ): CommandStatement {
    return mapValues(policy, (effectPolicy) => effectPolicy[scope])
  }
}
