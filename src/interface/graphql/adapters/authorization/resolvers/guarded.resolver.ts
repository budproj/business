import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { Resource } from '@adapters/authorization/enums/resource.enum'
import { Scope } from '@adapters/authorization/enums/scope.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { PolicyAdapter } from '@adapters/authorization/policy.adapter'

import { BaseGraphQLResolver } from '../../../resolvers/base.resolver'
import { RelayGraphQLAdapter } from '../../relay/relay.adapter'
import { PolicyGraphQLObject } from '../objects/policy.object'

export abstract class GuardedGraphQLResolver<P> extends BaseGraphQLResolver {
  protected readonly policy: PolicyAdapter
  protected readonly authz: AuthzAdapter
  protected readonly relay: RelayGraphQLAdapter

  constructor(protected readonly resource: Resource) {
    super()

    this.authz = new AuthzAdapter()
    this.policy = new PolicyAdapter()
  }

  protected async getPolicyForUserInScope(user: AuthorizationUser, scope: Scope, parent?: P) {
    const resourcePolicy = this.authz.getResourcePolicyFromPermissions(user.token.permissions)

    const resourcesCommandStatement = this.authz.getResourcesCommandStatementsForScopeFromPolicy(
      resourcePolicy,
      scope,
    )

    const commandStatement = resourcesCommandStatement[this.resource]
    const customizedCommandStatement = await this.customizePolicy(commandStatement, parent)

    return customizedCommandStatement
  }

  protected async customizePolicy(originalPolicy: PolicyGraphQLObject, _parent: P) {
    return originalPolicy
  }
}
