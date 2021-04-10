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
import { RelayProvider } from '@infrastructure/relay/relay.provider'

import { GraphQLUser } from '../../decorators/graphql-user'
import { ScopeGraphQLEnum } from '../../enums/scope.enum'
import { GuardedNodeGraphQLInterface } from '../interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '../objects/policy.object'

import { GuardedGraphQLResolver } from './guarded.resolver'

@Resolver(() => GuardedNodeGraphQLInterface)
export abstract class GuardedNodeGraphQLResolver<
  E extends CoreEntity,
  I extends CoreEntityInterface
> extends GuardedGraphQLResolver<E> {
  protected readonly queryGuard: QueryGuardAdapter<E, I>
  protected readonly policy: PolicyAdapter
  protected readonly authz: AuthzAdapter
  protected readonly relay: RelayProvider

  constructor(
    protected readonly resource: Resource,
    protected readonly core: CoreProvider,
    private readonly coreEntityProvider: CoreEntityProvider<E, I>,
  ) {
    super(resource)

    this.queryGuard = new QueryGuardAdapter(resource, core, coreEntityProvider)
  }

  @ResolveField('policy', () => PolicyGraphQLObject)
  protected async getConnectionPolicies(
    @Parent() node: E,
    @GraphQLUser() graphqlUser: AuthorizationUser,
    @Args('scope', { type: () => ScopeGraphQLEnum, nullable: true })
    scope?: Scope,
  ) {
    scope ??= await this.getHighestScopeForNodeInUserContext(node, graphqlUser)

    return this.getPolicyForUserInScope(graphqlUser, scope, node)
  }

  private async getHighestScopeForNodeInUserContext(node: E, user: AuthorizationUser) {
    const queryContext = await this.core.team.buildTeamQueryContext(user)
    const scope = await this.coreEntityProvider.defineResourceHighestScope(node, queryContext)

    return scope
  }
}
