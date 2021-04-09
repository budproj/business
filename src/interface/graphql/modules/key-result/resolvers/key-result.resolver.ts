import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { KeyResultInterface } from '@core/modules/key-result/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { KeyResultCommentGraphQLNode } from '@interface/graphql/nodes/key-result-comment.node'
import { KeyResultGraphQLNode } from '@interface/graphql/nodes/key-result.node'
import { ObjectiveGraphQLNode } from '@interface/graphql/nodes/objective.node'
import { TeamGraphQLNode } from '@interface/graphql/nodes/team.node'
import { UserGraphQLNode } from '@interface/graphql/nodes/user.node'
import { BaseGraphQLResolver } from '@interface/graphql/resolvers/base.resolver'
import { GraphQLUser } from '@interface/graphql/resolvers/decorators/graphql-user'
import { NourishUserDataInterceptor } from '@interface/graphql/resolvers/interceptors/nourish-user-data.interceptor'

import { KeyResultListGraphQLObject } from '../objects/key-result-list.object'
import { KeyResultFiltersRequest } from '../requests/key-result.request'
import { KeyResultRootEdgeGraphQLResponse } from '../responses/key-result-root-edge.response'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => KeyResultGraphQLNode)
export class KeyResultGraphQLResolver extends BaseGraphQLResolver<KeyResult, KeyResultInterface> {
  private readonly logger = new Logger(KeyResultGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT, core, core.keyResult)
  }

  @RequiredActions('key-result:read')
  @Query(() => KeyResultListGraphQLObject, { name: 'keyResults' })
  protected async getKeyResults(
    @Args() { first, ...filters }: KeyResultFiltersRequest,
    @GraphQLUser() graphqlUser: AuthorizationUser,
  ) {
    this.logger.log({
      first,
      filters,
      graphqlUser,
      message: 'Fetching key-results with filters',
    })

    const queryOptions: GetOptions<KeyResult> = {
      limit: first,
    }
    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      graphqlUser,
      queryOptions,
    )

    const edges = queryResult?.map((node) => new KeyResultRootEdgeGraphQLResponse({ node }))
    const response = this.marshalListResponse<KeyResultRootEdgeGraphQLResponse>(edges)

    return response
  }

  @ResolveField('owner', () => UserGraphQLNode)
  protected async getKeyResultOwner(@Parent() keyResult: KeyResultGraphQLNode) {
    this.logger.log({
      keyResult,
      message: 'Fetching owner for key result',
    })

    return this.core.user.getOne({ id: keyResult.ownerId })
  }

  @ResolveField('team', () => TeamGraphQLNode)
  protected async getKeyResultTeam(@Parent() keyResult: KeyResultGraphQLNode) {
    this.logger.log({
      keyResult,
      message: 'Fetching team for key result',
    })

    const team = await this.core.team.getOne({ id: keyResult.teamId })

    return team
  }

  @ResolveField('objective', () => ObjectiveGraphQLNode)
  protected async getKeyResultGraphQLNodeive(@Parent() keyResult: KeyResultGraphQLNode) {
    this.logger.log({
      keyResult,
      message: 'Fetching objective for key result',
    })

    return this.core.objective.getFromKeyResult(keyResult)
  }

  @ResolveField('keyResultComments', () => [KeyResultCommentGraphQLNode])
  protected async getKeyResultComments(@Parent() keyResult: KeyResultGraphQLNode) {
    this.logger.log({
      keyResult,
      message: 'Fetching comments for key result',
    })

    return this.core.keyResult.getComments(keyResult)
  }

  protected async customizeEntityPolicy(originalPolicy: PolicyGraphQLObject, keyResult: KeyResult) {
    const restrictedToActivePolicy = await this.restrictPolicyToActiveKeyResult(
      originalPolicy,
      keyResult,
    )

    return restrictedToActivePolicy
  }

  private async restrictPolicyToActiveKeyResult(
    originalPolicy: PolicyGraphQLObject,
    keyResult: KeyResult,
  ) {
    if (this.policy.commandStatementIsDenyingAll(originalPolicy)) return originalPolicy

    const objective = await this.core.objective.getFromKeyResult(keyResult)
    const cycle = await this.core.cycle.getFromObjective(objective)

    return cycle.active ? originalPolicy : this.policy.denyCommandStatement(originalPolicy)
  }
}
