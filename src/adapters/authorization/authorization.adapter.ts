import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { Action } from '@adapters/policy/types/action.type'
import { Permission } from '@adapters/policy/types/permission.type'

import { AuthorizationUser } from './interfaces/user.interface'

export class AuthorizationAdapter {
  private readonly policyAdapter: PolicyAdapter = new PolicyAdapter()

  public canUserExecuteActions(user: AuthorizationUser, actions?: Action[]): boolean {
    if (!actions || actions.length === 0) return true

    const userAllowedActions = this.policyAdapter.getActionsFromPermissions(user.token.permissions)
    if (userAllowedActions.length === 0) return false

    const canExecuteAllRequiredActions = actions.every((action) =>
      userAllowedActions.includes(action),
    )

    return canExecuteAllRequiredActions
  }

  public canUserExecutePermissions(user: AuthorizationUser, permissions?: Permission[]): boolean {
    if (!permissions || permissions.length === 0) return true

    const userHasAllPermissions = permissions.every((permission) =>
      user.token.permissions.includes(permission),
    )

    return userHasAllPermissions
  }
}
