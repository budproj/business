import { AuthorizationAdapter } from '@adapters/authorization/authorization.adapter'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { Scope } from '@adapters/policy/enums/scope.enum'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'

import { BaseGraphQLResolver } from '../../../resolvers/base.resolver'
import { RelayGraphQLAdapter } from '../../relay/relay.adapter'
import { PolicyGraphQLObject } from '../objects/policy.object'

export abstract class GuardedGraphQLResolver<P> extends BaseGraphQLResolver {
  protected readonly authorization: AuthorizationAdapter = new AuthorizationAdapter()
  protected readonly policy: PolicyAdapter = new PolicyAdapter()
  protected readonly relay: RelayGraphQLAdapter

  protected constructor(protected readonly resource: Resource) {
    super()
  }

  protected async getPolicyForUserInScope(user: UserWithContext, scope: Scope, parent?: P) {
    const resourcePolicy = this.policy.getResourcePolicyFromPermissions(user.token.permissions)

    const resourcesCommandStatement = this.policy.getResourcesCommandStatementsForScopeFromPolicy(
      resourcePolicy,
      scope,
    )

    const commandStatement = resourcesCommandStatement[this.resource]
    return this.customizePolicy(commandStatement, parent)
  }

  protected async customizePolicy(originalPolicy: PolicyGraphQLObject, _parent: P) {
    return originalPolicy
  }
}
