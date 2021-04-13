import { Logger } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/objects/key-result/check-in/key-result-check-in.node'
import { KeyResultCommentGraphQLNode } from '@interface/graphql/objects/key-result/comment/key-result-comment.node'
import { KeyResultGraphQLNode } from '@interface/graphql/objects/key-result/key-result.node'
import { KeyResultsGraphQLConnection } from '@interface/graphql/objects/key-result/key-results.connection'
import { ObjectiveGraphQLNode } from '@interface/graphql/objects/objective/objective.node'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { KeyResultFiltersRequest } from '../requests/key-result-filters.request'

@GuardedResolver(KeyResultGraphQLNode)
export class KeyResultGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResult,
  KeyResultInterface
> {
  private readonly logger = new Logger(KeyResultGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT, core, core.keyResult)
  }

  @GuardedQuery(KeyResultGraphQLNode, 'key-result:read', { name: 'keyResult' })
  protected async getKeyResultForRequestAndAuthorizedRequestUser(
    @Args() request: NodeIndexesRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      message: 'Fetching key-result with provided indexes',
    })

    const keyResult = await this.queryGuard.getOneWithActionScopeConstraint(
      request,
      authorizationUser,
    )
    if (!keyResult)
      throw new UserInputError(`We could not found an key-result with the provided arguments`)

    return keyResult
  }

  @GuardedQuery(KeyResultsGraphQLConnection, 'key-result:read', { name: 'keyResults' })
  protected async getKeyResultsForRequestAndAuthorizedRequestUser(
    @Args() request: KeyResultFiltersRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizationUser,
      message: 'Fetching key-results with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultFiltersRequest,
      KeyResult
    >(request)

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      authorizationUser,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResult>(queryResult, connection)
  }

  @ResolveField('owner', () => UserGraphQLNode)
  protected async getOwnerForKeyResult(@Parent() keyResult: KeyResultGraphQLNode) {
    this.logger.log({
      keyResult,
      message: 'Fetching owner for key result',
    })

    return this.core.user.getOne({ id: keyResult.ownerId })
  }

  @ResolveField('team', () => TeamGraphQLNode)
  protected async getTeamForKeyResult(@Parent() keyResult: KeyResultGraphQLNode) {
    this.logger.log({
      keyResult,
      message: 'Fetching team for key result',
    })

    const team = await this.core.team.getOne({ id: keyResult.teamId })

    return team
  }

  @ResolveField('objective', () => ObjectiveGraphQLNode)
  protected async getObjectiveForKeyResult(@Parent() keyResult: KeyResultGraphQLNode) {
    this.logger.log({
      keyResult,
      message: 'Fetching objective for key result',
    })

    return this.core.objective.getFromKeyResult(keyResult)
  }

  @ResolveField('keyResultComments', () => [KeyResultCommentGraphQLNode])
  protected async getKeyResultCommentsForKeyResult(@Parent() keyResult: KeyResultGraphQLNode) {
    this.logger.log({
      keyResult,
      message: 'Fetching comments for key result',
    })

    return this.core.keyResult.getComments(keyResult)
  }

  @ResolveField('isOutdated', () => Boolean)
  protected async getIsOutdatedForKeyResult(@Parent() keyResult: KeyResultGraphQLNode) {
    this.logger.log({
      keyResult,
      message: 'Deciding if the given key result is outdated',
    })

    const objective = await this.core.objective.getFromKeyResult(keyResult)
    const latestKeyResultCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(
      keyResult,
    )

    const enhancedKeyResult = {
      ...keyResult,
      objective,
      checkIns: latestKeyResultCheckIn ? [latestKeyResultCheckIn] : undefined,
    }

    return this.core.keyResult.isOutdated(enhancedKeyResult)
  }

  @ResolveField('latestKeyResultCheckIn', () => KeyResultCheckInGraphQLNode, { nullable: true })
  protected async getLatestKeyResultCheckInForKeyResult(@Parent() keyResult: KeyResultGraphQLNode) {
    this.logger.log({
      keyResult,
      message: 'Fetching latest key result check-in for key result',
    })

    return this.core.keyResult.getLatestCheckInForKeyResultAtDate(keyResult)
  }

  protected async customizeEntityPolicy(
    originalPolicy: PolicyGraphQLObject,
    keyResult: KeyResultGraphQLNode,
  ) {
    const restrictedToActivePolicy = await this.restrictPolicyToActiveKeyResult(
      originalPolicy,
      keyResult,
    )

    return restrictedToActivePolicy
  }

  private async restrictPolicyToActiveKeyResult(
    originalPolicy: PolicyGraphQLObject,
    keyResult: KeyResultGraphQLNode,
  ) {
    if (this.policy.commandStatementIsDenyingAll(originalPolicy)) return originalPolicy

    const isObjectiveActive = await this.core.objective.isActiveFromIndexes({
      id: keyResult.objectiveId,
    })

    return isObjectiveActive ? originalPolicy : this.policy.denyCommandStatement(originalPolicy)
  }
}
