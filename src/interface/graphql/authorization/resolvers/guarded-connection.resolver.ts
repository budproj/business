import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

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

import { RelayGraphQLProvider } from '../../relay/relay.provider'
import { AuthorizedRequestUser } from '../decorators/authorized-request-user.decorator'
import { ScopeGraphQLEnum } from '../enums/scope.enum'
import { GuardedConnectionGraphQLInterface } from '../interfaces/guarded-connection.interface'
import { GuardedNodeGraphQLInterface } from '../interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '../objects/policy.object'

import { GuardedGraphQLResolver } from './guarded.resolver'

@Resolver(() => GuardedConnectionGraphQLInterface)
export abstract class GuardedConnectionGraphQLResolver<
  E extends CoreEntity,
  I extends CoreEntityInterface,
  N extends GuardedNodeGraphQLInterface,
  C extends GuardedConnectionGraphQLInterface<N> = GuardedConnectionGraphQLInterface<N>
> extends GuardedGraphQLResolver<C> {
  protected readonly queryGuard: QueryGuardAdapter<E, I>
  protected readonly policy: PolicyAdapter
  protected readonly authz: AuthzAdapter
  protected readonly relay: RelayGraphQLProvider

  constructor(
    protected readonly resource: Resource,
    protected readonly core: CoreProvider,
    coreEntityProvider: CoreEntityProvider<E, I>,
  ) {
    super(resource)

    this.queryGuard = new QueryGuardAdapter(resource, core, coreEntityProvider)
  }

  @ResolveField('policy', () => PolicyGraphQLObject)
  protected async getConnectionPolicies(
    @Parent() parent: C,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
    @Args('scope', { type: () => ScopeGraphQLEnum })
    scope: Scope,
  ) {
    return this.getPolicyForUserInScope(authorizationUser, scope, parent)
  }
}
