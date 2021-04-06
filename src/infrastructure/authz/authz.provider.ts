import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { zipObject } from 'lodash'

import { ActionStatement } from '@adapters/authorization/action-statement.interface'
import { Action } from '@adapters/authorization/enums/action.enum'
import { Effect } from '@adapters/authorization/enums/effect.enum'
import { Resource } from '@adapters/authorization/enums/resource.enum'
import { Scope } from '@adapters/authorization/enums/scope.enum'
import { Permission } from '@adapters/authorization/permission.interface'
import { Policy } from '@adapters/authorization/policy.interface'
import { ResourceStatement } from '@adapters/authorization/resource-statement.interface'
import { ScopeStatement } from '@adapters/authorization/scope-statement.interface'

@Injectable()
export class AuthzProvider {
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

  constructor(private readonly reflector: Reflector) {}

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
    const policy = `${resource}:${action}` as Policy
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
}
