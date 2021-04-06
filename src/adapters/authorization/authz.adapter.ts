import { uniq, zipObject } from 'lodash'

import { Action } from './enums/action.enum'
import { Effect } from './enums/effect.enum'
import { Resource } from './enums/resource.enum'
import { Scope } from './enums/scope.enum'
import { AuthorizationUser } from './interfaces/user.interface'
import { ActionStatement } from './types/action-statement.type'
import { Permission } from './types/permission.type'
import { Policy } from './types/policy.type'
import { ResourceStatement } from './types/resource-statement.type'
import { ScopeStatement } from './types/scope-statement.type'

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

  public marshalPermissions(
    permissions: Permission[],
    resources: Resource[] = this.resources,
  ): ResourceStatement {
    const actionStatements = resources.map((resource) =>
      this.getResourceActionStatementFromPermissions(resource, permissions),
    )
    const resourceStatement = zipObject<Resource, ActionStatement>(resources, actionStatements)

    return resourceStatement
  }

  public userHasRequiredPolicies(user: AuthorizationUser, requiredPolicies?: Policy[]): boolean {
    if (!requiredPolicies || requiredPolicies.length === 0) return true

    const userAllowedPolicies = this.getPoliciesFromPermissions(user.token.permissions)
    if (userAllowedPolicies.length === 0) return false

    const hasAllRequiredPolicies = requiredPolicies.every((requiredPolicy) =>
      userAllowedPolicies.includes(requiredPolicy),
    )

    return hasAllRequiredPolicies
  }

  private getResourceActionStatementFromPermissions(
    resource: Resource,
    permissions: Permission[],
  ): ActionStatement {
    const actions = [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE]
    const scopeStatements = actions.map((action) =>
      this.getScopeStatementForResourceActionFromPermissions(resource, action, permissions),
    )

    const actionStatement = zipObject<Action, ScopeStatement>(actions, scopeStatements)

    return actionStatement
  }

  private getScopeStatementForResourceActionFromPermissions(
    resource: Resource,
    action: Action,
    permissions: Permission[],
  ): ScopeStatement {
    const policy: Policy = `${resource}:${action}` as const
    const policyPermissions = this.filterPolicyPermissions(policy, permissions)
    const scopes = [Scope.ANY, Scope.COMPANY, Scope.TEAM, Scope.OWNS]
    const effects = scopes.map((scope) =>
      this.getScopeEffectForPolicyFromPermissions(scope, policy, policyPermissions),
    )

    const scopeStatement = zipObject<Scope, Effect>(scopes, effects)

    return scopeStatement
  }

  private getScopeEffectForPolicyFromPermissions(
    scope: Scope,
    policy: Policy,
    permissions: Permission[],
  ): Effect {
    const requiredPermission = `${policy}:${scope}`
    const hasPermission = permissions.some((permission) => permission.includes(requiredPermission))

    return hasPermission ? Effect.ALLOW : Effect.DENY
  }

  private filterPolicyPermissions(policy: Policy, permissions: Permission[]) {
    return permissions.filter((permission) => permission.includes(policy))
  }

  private getPoliciesFromPermissions(permissions: Permission[]): Policy[] {
    const policies: Policy[] = permissions.map((permission) => this.drillUp<Policy>(permission))
    const uniqPolicies = uniq(policies)

    return uniqPolicies
  }

  private drillUp<T extends string = string>(value: string): T {
    return value.split(':').slice(0, -1).join(':') as T
  }
}
