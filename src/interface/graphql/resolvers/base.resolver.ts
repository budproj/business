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
import { NodeGraphQLInterface } from '@interface/graphql/interfaces/node.interface'
import { QueryResultGraphQLInterface } from '@interface/graphql/interfaces/query-result.interface'
import { PolicyGraphQLObject } from '@interface/graphql/objects/policy.object'
import { PageInfoGraphQLResponse } from '@interface/graphql/responses/page-info.reponse'
import { QueryResultGraphQLResponse } from '@interface/graphql/responses/query-result.response'

import { EdgesGraphQLInterface } from '../interfaces/edges.interface'
import { EdgesGraphQLResponse } from '../responses/edges.response'

import { GraphQLUser } from './decorators/graphql-user'

@Resolver(() => NodeGraphQLInterface)
export abstract class BaseGraphQLResolver<E extends CoreEntity, I> {
  protected readonly queryGuard: QueryGuardAdapter<E, I>
  protected readonly authz: AuthzAdapter

  constructor(
    protected readonly resource: Resource,
    protected readonly core: CoreProvider,
    protected readonly entity: CoreEntityProvider<E, I>,
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

    const resourcePolicy = this.authz.getResourcePolicyFromPermissions(
      graphqlUser.token.permissions,
    )

    const resourcesCommandStatement = this.authz.getResourcesCommandStatementsForScopeFromPolicy(
      resourcePolicy,
      scope,
    )

    const commandStatement = resourcesCommandStatement[resource]
    const customizedCommandStatement = await this.customizeEntityCommandStatement(
      commandStatement,
      entity,
    )

    return customizedCommandStatement
  }

  protected async customizeEntityCommandStatement(
    originalStatement: PolicyGraphQLObject,
    _entity: E,
  ) {
    return originalStatement
  }

  protected denyAllPolicies(originalPolicies: PolicyGraphQLObject) {
    return mapValues(originalPolicies, () => Effect.DENY)
  }

  protected marshalQueryResponse<N extends NodeGraphQLInterface = NodeGraphQLInterface>(
    nodes: N[],
  ): QueryResultGraphQLInterface {
    const queryEdges = new EdgesGraphQLResponse<N>(nodes)
    const queryPageInfo = new PageInfoGraphQLResponse(nodes)
    const queryResult = new QueryResultGraphQLResponse<EdgesGraphQLInterface<N>>(
      queryEdges.marshal(),
      queryPageInfo.marshal(),
    )

    return queryResult.marshal()
  }

  private async getHighestScopeForEntity(entity: E, user: AuthorizationUser) {
    const queryContext = await this.core.team.buildTeamQueryContext(user)
    const constraint = await this.entity.defineResourceHighestConstraint(entity, queryContext)

    return constraint
  }
}
