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
  protected readonly authz: PolicyAdapter
  protected readonly relay: RelayGraphQLAdapter

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
    @RequestUserWithContext() userWithContext: UserWithContext,
    @Args('scope', { type: () => ScopeGraphQLEnum, nullable: true })
    scope?: Scope,
  ) {
    scope ??= await this.getHighestScopeForNodeInUserContext(node, userWithContext)

    const policy = await this.getPolicyForUserInScope(userWithContext, scope, node)
    const controlledPolicy = await this.controlNodePolicy(policy, node)

    return controlledPolicy
  }

  protected async controlNodePolicy(
    policy: PolicyGraphQLObject,
    _node: E,
  ): Promise<PolicyGraphQLObject> {
    return policy
  }

  private async getHighestScopeForNodeInUserContext(
    node: E,
    user: UserWithContext,
  ): Promise<Scope> {
    const queryContext = await this.core.team.buildTeamQueryContext(user)
    const scope = await this.coreEntityProvider.defineResourceHighestScope(node, queryContext)

    return scope
  }
}
