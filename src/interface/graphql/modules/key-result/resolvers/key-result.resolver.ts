import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { KeyResultInterface } from '@core/modules/key-result/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { KeyResultCommentGraphQLNode } from '@interface/graphql/objects/key-result/comment/key-result-comment.node'
import { KeyResultGraphQLNode } from '@interface/graphql/objects/key-result/key-result.node'
import { KeyResultsGraphQLConnection } from '@interface/graphql/objects/key-result/key-results.connection'
import { ObjectiveGraphQLNode } from '@interface/graphql/objects/objective/objective.node'
import { TeamGraphQLNode } from '@interface/graphql/objects/team/team.node'
import { UserGraphQLNode } from '@interface/graphql/objects/user/user.node'
import { NourishUserDataInterceptor } from '@interface/graphql/resolvers/interceptors/nourish-user-data.interceptor'

import { KeyResultFiltersRequest } from '../requests/key-result-filters.request'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => KeyResultGraphQLNode)
export class KeyResultGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResult,
  KeyResultInterface
> {
  private readonly logger = new Logger(KeyResultGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT, core, core.keyResult)
  }

  @RequiredActions('key-result:read')
  @Query(() => KeyResultsGraphQLConnection, { name: 'keyResults' })
  protected async getKeyResults(
    @Args() request: KeyResultFiltersRequest,
    @AuthorizedRequestUser() authorizedRequestUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizedRequestUser,
      message: 'Fetching key-results with filters',
    })

    const [connection, filters] = this.relay.unmarshalRequest(request)

    const queryOptions: GetOptions<KeyResult> = {
      limit: connection.first,
    }
    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      authorizedRequestUser,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResult>(queryResult, connection)
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
