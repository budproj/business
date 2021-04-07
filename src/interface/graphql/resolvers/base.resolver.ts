import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { mapValues } from 'lodash'

import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { Effect } from '@adapters/authorization/enums/effect.enum'
import { Resource } from '@adapters/authorization/enums/resource.enum'
import { Scope } from '@adapters/authorization/enums/scope.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { QueryGuardAdapter } from '@adapters/authorization/query-guard.adapter'
import { CoreEntity } from '@core/core.entity'
import { CoreProvider } from '@core/core.provider'
import { CoreEntityProvider } from '@core/entity.provider'
import { ResourceGraphQLEnum } from '@interface/graphql/enums/resource.enum'
import { ScopeGraphQLEnum } from '@interface/graphql/enums/scope.enum'
import { EntityGraphQLObject } from '@interface/graphql/objects/entity.object'
import { PolicyGraphQLObject } from '@interface/graphql/objects/policy.object'

import { GraphQLUser } from './decorators/graphql-user'

@Resolver(() => EntityGraphQLObject)
export abstract class BaseGraphQLResolver<E extends CoreEntity, D> {
  protected readonly queryGuard: QueryGuardAdapter<E, D>
  protected readonly authz: AuthzAdapter

  constructor(
    protected readonly resource: Resource,
    protected readonly core: CoreProvider,
    protected readonly entity: CoreEntityProvider<E, D>,
  ) {
    this.queryGuard = new QueryGuardAdapter(resource, core, entity)
    this.authz = new AuthzAdapter()
  }

  @ResolveField('policies', () => PolicyGraphQLObject)
  protected async getEntityPolicies(
    @Parent() entity: E,
    @GraphQLUser() graphqlUser: AuthorizationUser,
    @Args('scope', { type: () => ScopeGraphQLEnum, nullable: true })
    scope: Scope,
    @Args('resource', { type: () => ResourceGraphQLEnum, nullable: true })
    resource: Resource = this.resource,
  ) {
    scope ??= await this.getHighestScopeForEntity(entity, graphqlUser)

    console.log(scope, resource, graphqlUser)

    // Const userPermissions = this.authz.getUserPoliciesForConstraint(authzUser, constraint)
    // const resourcePolicy = userPermissions[resource]

    // const customizedResourcePolicy = await this.customizeEntityPolicies(resourcePolicy, entity)

    return {}
  }

  protected async customizeEntityPolicies(originalPolicies: PolicyGraphQLObject, _entity: E) {
    return originalPolicies
  }

  protected denyAllPolicies(originalPolicies: PolicyGraphQLObject) {
    return mapValues(originalPolicies, () => Effect.DENY)
  }

  private async getHighestScopeForEntity(entity: E, user: AuthorizationUser) {
    const queryContext = await this.core.team.buildTeamQueryContext(user)
    const constraint = await this.entity.defineResourceHighestConstraint(entity, queryContext)

    return constraint
  }
}
