import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { Resource } from '@adapters/authorization/enums/resource.enum'
import { Scope } from '@adapters/authorization/enums/scope.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { PolicyAdapter } from '@adapters/authorization/policy.adapter'
import { QueryGuardAdapter } from '@adapters/authorization/query-guard.adapter'
import { CoreEntityInterface } from '@core/core-entity.interface'
import { CoreEntity } from '@core/core.orm-entity'
import { CoreProvider } from '@core/core.provider'
import { CoreEntityProvider } from '@core/entity.provider'
import { RelayProvider } from '@infrastructure/relay/relay.provider'
import { BaseGraphQLResolver } from '@interface/graphql/resolvers/base.resolver'

import { PolicyGraphQLObject } from '../objects/policy.object'

export abstract class GuardedGraphQLResolver<
  E extends CoreEntity,
  I extends CoreEntityInterface
> extends BaseGraphQLResolver {
  protected readonly queryGuard: QueryGuardAdapter<E, I>
  protected readonly policy: PolicyAdapter
  protected readonly authz: AuthzAdapter
  protected readonly relay: RelayProvider

  constructor(
    protected readonly resource: Resource,
    protected readonly core: CoreProvider,
    coreEntityProvider: CoreEntityProvider<E, I>,
  ) {
    super()

    this.queryGuard = new QueryGuardAdapter(resource, core, coreEntityProvider)
    this.authz = new AuthzAdapter()
    this.policy = new PolicyAdapter()
  }

  protected async getPolicyForUserInScope(user: AuthorizationUser, scope: Scope, parent?: E) {
    const resourcePolicy = this.authz.getResourcePolicyFromPermissions(user.token.permissions)

    const resourcesCommandStatement = this.authz.getResourcesCommandStatementsForScopeFromPolicy(
      resourcePolicy,
      scope,
    )

    const commandStatement = resourcesCommandStatement[this.resource]
    const customizedCommandStatement = await this.customizePolicy(commandStatement, parent)

    return customizedCommandStatement
  }

  protected async customizePolicy(originalPolicy: PolicyGraphQLObject, _parent: E) {
    return originalPolicy
  }
}
