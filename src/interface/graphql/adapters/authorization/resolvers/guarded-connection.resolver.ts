import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { QueryGuardAdapter } from '@adapters/authorization/query-guard.adapter'
import { UserWithContext } from '@adapters/context/interfaces/user.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { Scope } from '@adapters/policy/enums/scope.enum'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { CoreEntityInterface } from '@core/core-entity.interface'
import { CoreEntity } from '@core/core.orm-entity'
import { CoreProvider } from '@core/core.provider'
import { CoreEntityProvider } from '@core/entity.provider'

import { RequestUserWithContext } from '../../context/decorators/request-user-with-context.decorator'
import { RelayGraphQLAdapter } from '../../relay/relay.adapter'
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
  protected readonly authz: PolicyAdapter
  protected readonly relay: RelayGraphQLAdapter

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
    @RequestUserWithContext() userWithContext: UserWithContext,
    @Args('scope', { type: () => ScopeGraphQLEnum })
    scope: Scope,
  ) {
    return this.getPolicyForUserInScope(userWithContext, scope, parent)
  }
}
