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
    Resource.WORKSPACE,
  ]

  static drillUp<T extends string = string>(value: string): T {
    return value.split(':').slice(0, -1).join(':') as T
  }

  static buildAction(resource: Resource, command: Command): Action {
    return `${resource}:${command}` as const
  }

  static userHasPermission(user: AuthorizationUser, permission: Permission): boolean {
    return user.token.permissions.includes(permission)
  }

  static buildPermissionFromAction(action: Action, scope: Scope): Permission {
    return `${action}:${scope}` as const
  }

  public getResourcePolicyFromPermissions(
    permissions: Permission[],
    resources: Resource[] = this.resources,
  ): ResourcePolicy {
    const commandPolicies = resources.map((resource) =>
      this.getCommandPoliciesForResourceFromPermissions(resource, permissions),
    )

    return zipObject<Resource, CommandPolicy>(resources, commandPolicies)
  }

  public getResourceCommandScopeForUser(
    resource: Resource,
    command: Command,
    user: AuthorizationUser,
  ): Scope {
    const action = PolicyAdapter.buildAction(resource, command)

    return this.getHighestScopeForActionFromUser(action, user)
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

  public getActionsFromPermissions(permissions: Permission[]): Action[] {
    const actions: Action[] = permissions.map((permission) =>
      PolicyAdapter.drillUp<Action>(permission),
    )

    return uniq(actions)
  }

  public buildPermission(resource: Resource, command: Command, scope: Scope): Permission {
    return `${resource}:${command}:${scope}` as const
  }

  public getEffectForBoolean(bool: boolean): Effect {
    return bool ? Effect.ALLOW : Effect.DENY
  }

  private getCommandPoliciesForResourceFromPermissions(
    resource: Resource,
    permissions: Permission[],
  ): CommandPolicy {
    const commands = [Command.CREATE, Command.READ, Command.UPDATE, Command.DELETE]
    const scopePolicies = commands.map((command) =>
      this.getScopePoliciesForResourceCommandFromPermissions(resource, command, permissions),
    )

    return zipObject<Command, ScopePolicy>(commands, scopePolicies)
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

    return zipObject<Scope, Effect>(scopes, effectPolicies)
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

  private getHighestScopeForActionFromUser(
    action: Action,
    user: AuthorizationUser,
  ): Scope | undefined {
    return SCOPE_PRIORITY.find((scope) => {
      const permission = PolicyAdapter.buildPermissionFromAction(action, scope)

      return PolicyAdapter.userHasPermission(user, permission)
    })
  }

  private getCommandStatementsForScopeFromPolicy(
    policy: CommandPolicy,
    scope: Scope,
  ): CommandStatement {
    return mapValues(policy, (effectPolicy) => effectPolicy[scope])
  }
}
