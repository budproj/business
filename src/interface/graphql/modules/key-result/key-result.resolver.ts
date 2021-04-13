import { Logger } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCommentInterface } from '@core/modules/key-result/comment/key-result-comment.interface'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { ObjectiveGraphQLNode } from '@interface/graphql/modules/objective/objective.node'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { KeyResultCheckInGraphQLNode } from './check-in/key-result-check-in.node'
import { KeyResultCheckInFiltersRequest } from './check-in/requests/key-result-check-in-filters.request'
import { KeyResultCommentFiltersRequest } from './comment/requests/key-result-comment-filters.request'
import { KeyResultKeyResultCheckInsGraphQLConnection } from './connections/key-result-key-result-check-ins/key-result-key-result-check-ins.connection'
import { KeyResultKeyResultCommentsGraphQLConnection } from './connections/key-result-key-result-comments/key-result-key-result-comments.connection'
import { KeyResultGraphQLNode } from './key-result.node'

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

  @ResolveField('keyResultComments', () => KeyResultKeyResultCommentsGraphQLConnection)
  protected async getKeyResultCommentsForKeyResult(
    @Args() request: KeyResultCommentFiltersRequest,
    @Parent() keyResult: KeyResult,
  ) {
    this.logger.log({
      keyResult,
      request,
      message: 'Fetching key-result comments',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultCommentFiltersRequest,
      KeyResultComment
    >(request)

    const queryResult = await this.core.keyResult.getComments(keyResult, filters, queryOptions)

    return this.relay.marshalResponse<KeyResultCommentInterface>(queryResult, connection)
  }

  @ResolveField('keyResultCheckIns', () => KeyResultKeyResultCheckInsGraphQLConnection)
  protected async getKeyResultCheckInsForKeyResult(
    @Args() request: KeyResultCheckInFiltersRequest,
    @Parent() keyResult: KeyResult,
  ) {
    this.logger.log({
      keyResult,
      request,
      message: 'Fetching key-result check-ins',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultCommentFiltersRequest,
      KeyResultComment
    >(request)

    const queryResult = await this.core.keyResult.getCheckIns(keyResult, filters, queryOptions)

    return this.relay.marshalResponse<KeyResultCheckInInterface>(queryResult, connection)
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
