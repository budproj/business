import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { Resource } from '@adapters/authorization/enums/resource.enum'
import { Scope } from '@adapters/authorization/enums/scope.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { PolicyAdapter } from '@adapters/authorization/policy.adapter'
import { CoreProvider } from '@core/core.provider'
import { RelayProvider } from '@infrastructure/relay/relay.provider'

import { GraphQLUser } from '../../decorators/graphql-user'
import { ScopeGraphQLEnum } from '../../enums/scope.enum'
import { GuardedConnectionGraphQLInterface } from '../interfaces/guarded-connection.interface'
import { GuardedNodeGraphQLInterface } from '../interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '../objects/policy.object'

import { GuardedGraphQLResolver } from './guarded.resolver'

@Resolver(() => GuardedConnectionGraphQLInterface)
export abstract class GuardedConnectionGraphQLResolver<
  N extends GuardedNodeGraphQLInterface,
  C extends GuardedConnectionGraphQLInterface<N> = GuardedConnectionGraphQLInterface<N>
> extends GuardedGraphQLResolver<C> {
  protected readonly policy: PolicyAdapter
  protected readonly authz: AuthzAdapter
  protected readonly relay: RelayProvider

  constructor(protected readonly resource: Resource, protected readonly core: CoreProvider) {
    super(resource, core)
  }

  @ResolveField('policy', () => PolicyGraphQLObject)
  protected async getConnectionPolicies(
    @Parent() parent: C,
    @GraphQLUser() graphqlUser: AuthorizationUser,
    @Args('scope', { type: () => ScopeGraphQLEnum })
    scope: Scope,
  ) {
    return this.getPolicyForUserInScope(graphqlUser, scope, parent)
  }
}
