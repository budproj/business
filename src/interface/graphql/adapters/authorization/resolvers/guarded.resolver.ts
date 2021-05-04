import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { Scope } from '@adapters/policy/enums/scope.enum'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'

import { BaseGraphQLResolver } from '../../../resolvers/base.resolver'
import { RelayGraphQLAdapter } from '../../relay/relay.adapter'
import { PolicyGraphQLObject } from '../objects/policy.object'

export abstract class GuardedGraphQLResolver<P> extends BaseGraphQLResolver {
  protected readonly policy: PolicyAdapter
  protected readonly authz: PolicyAdapter
  protected readonly relay: RelayGraphQLAdapter

  constructor(protected readonly resource: Resource) {
    super()

    this.authz = new PolicyAdapter()
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
