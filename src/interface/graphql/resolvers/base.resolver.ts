import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { Resource } from '@adapters/authorization/enums/resource.enum'
import { Scope } from '@adapters/authorization/enums/scope.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { PolicyAdapter } from '@adapters/authorization/policy.adapter'
import { QueryGuardAdapter } from '@adapters/authorization/query-guard.adapter'
import { CoreEntity } from '@core/core.entity'
import { CoreProvider } from '@core/core.provider'
import { CoreEntityProvider } from '@core/entity.provider'

import { PolicyGraphQLObject } from '../authorization/objects/policy.object'
import { ResourceGraphQLEnum } from '../enums/resource.enum'
import { ScopeGraphQLEnum } from '../enums/scope.enum'
import { ListGraphQLInterface } from '../interfaces/list.interface'
import { NodeGraphQLInterface } from '../interfaces/node.interface'
import { EdgeGraphQLResponse } from '../responses/edge.response'
import { ListGraphQLResponse } from '../responses/list.response'
import { PageInfoGraphQLResponse } from '../responses/page-info.reponse'

import { GraphQLUser } from './decorators/graphql-user'

@Resolver(() => NodeGraphQLInterface)
export abstract class BaseGraphQLResolver<E extends CoreEntity, I> {
  protected readonly queryGuard: QueryGuardAdapter<E, I>
  protected readonly policy: PolicyAdapter
  protected readonly authz: AuthzAdapter

  constructor(
    protected readonly resource: Resource,
    protected readonly core: CoreProvider,
    protected readonly entity: CoreEntityProvider<E, I>,
  ) {
    this.queryGuard = new QueryGuardAdapter(resource, core, entity)
    this.authz = new AuthzAdapter()
    this.policy = new PolicyAdapter()
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

    const resourcePolicy = this.authz.getResourcePolicyFromPermissions(
      graphqlUser.token.permissions,
    )

    const resourcesCommandStatement = this.authz.getResourcesCommandStatementsForScopeFromPolicy(
      resourcePolicy,
      scope,
    )

    const commandStatement = resourcesCommandStatement[resource]
    const customizedCommandStatement = await this.customizeEntityPolicy(commandStatement, entity)

    return customizedCommandStatement
  }

  protected async customizeEntityPolicy(originalPolicy: PolicyGraphQLObject, _entity: E) {
    return originalPolicy
  }

  protected marshalListResponse<E extends EdgeGraphQLResponse>(edges: E[]): ListGraphQLInterface {
    const pageInfo = new PageInfoGraphQLResponse<E>({ edges })
    const queryResult = new ListGraphQLResponse<E>({ edges, pageInfo })

    return queryResult.marshal()
  }

  private async getHighestScopeForEntity(entity: E, user: AuthorizationUser) {
    const queryContext = await this.core.team.buildTeamQueryContext(user)
    const constraint = await this.entity.defineResourceHighestConstraint(entity, queryContext)

    return constraint
  }
}
