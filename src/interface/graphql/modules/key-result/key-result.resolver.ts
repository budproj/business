import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { UpdatedKeyResultActivity } from '@adapters/activity/activities/updated-key-result-activity'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { State } from '@adapters/state/interfaces/state.interface'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResultCommentInterface } from '@core/modules/key-result/comment/key-result-comment.interface'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { AttachActivity } from '@interface/graphql/adapters/activity/attach-activity.decorator'
import { RequestActivity } from '@interface/graphql/adapters/activity/request-activity.decorator'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestState } from '@interface/graphql/adapters/context/decorators/request-state.decorator'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { KeyResultAccessControl } from '@interface/graphql/modules/key-result/key-result.access-control'
import { ObjectiveGraphQLNode } from '@interface/graphql/modules/objective/objective.node'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { KeyResultCheckInGraphQLNode } from './check-in/key-result-check-in.node'
import { KeyResultCheckInFiltersRequest } from './check-in/requests/key-result-check-in-filters.request'
import { KeyResultCommentFiltersRequest } from './comment/requests/key-result-comment-filters.request'
import { KeyResultKeyResultCheckInsGraphQLConnection } from './connections/key-result-key-result-check-ins/key-result-key-result-check-ins.connection'
import { KeyResultKeyResultCommentsGraphQLConnection } from './connections/key-result-key-result-comments/key-result-key-result-comments.connection'
import { KeyResultTimelineGraphQLConnection } from './connections/key-result-timeline/key-result-key-result-timeline.connection'
import { KeyResultGraphQLNode } from './key-result.node'
import { KeyResultUpdateRequest } from './requests/key-result-update.request'

@GuardedResolver(KeyResultGraphQLNode)
export class KeyResultGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResult,
  KeyResultInterface
> {
  private readonly logger = new Logger(KeyResultGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    protected readonly corePorts: CorePortsProvider,
    protected readonly accessControl: KeyResultAccessControl,
  ) {
    super(Resource.KEY_RESULT, core, core.keyResult)
  }

  @GuardedQuery(KeyResultGraphQLNode, 'key-result:read', { name: 'keyResult' })
  protected async getKeyResultForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      message: 'Fetching key-result with provided indexes',
    })

    const keyResult = await this.queryGuard.getOneWithActionScopeConstraint(
      request,
      userWithContext,
    )
    if (!keyResult)
      throw new UserInputError(`We could not found an key-result with the provided arguments`)

    return keyResult
  }

  @AttachActivity(UpdatedKeyResultActivity)
  @GuardedMutation(KeyResultGraphQLNode, 'key-result:update', { name: 'updateKeyResult' })
  protected async updateKeyResultForRequestAndRequestUserWithContext(
    @Args() request: KeyResultUpdateRequest,
    @RequestState() state: State,
    @RequestActivity() activity: UpdatedKeyResultActivity,
  ) {
    const canUpdate = await this.accessControl.canUpdate(state.user, request.id)
    if (!canUpdate) throw new UnauthorizedException()

    this.logger.log({
      state,
      request,
      message: 'Received update key-result request',
    })

    const originalKeyResult = await this.corePorts.dispatchCommand<KeyResult>('get-key-result', {
      id: request.id,
    })
    activity.attachToContext({
      originalKeyResult,
    })

    const keyResult = await this.corePorts.dispatchCommand<KeyResult>(
      'update-key-result',
      request.id,
      { ...request.data },
    )
    if (!keyResult)
      throw new UserInputError(`We could not found an key-result with ID ${request.id}`)

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

    return this.core.team.getOne({ id: keyResult.teamId })
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

  @ResolveField('timeline', () => KeyResultTimelineGraphQLConnection)
  protected async getKeyResultTimeline(
    @Args() request: ConnectionFiltersRequest,
    @Parent() keyResult: KeyResultGraphQLNode,
  ) {
    this.logger.log({
      keyResult,
      request,
      message: 'Fetching timeline for key result',
    })

    const connection = this.relay.unmarshalRequest<
      ConnectionFiltersRequest,
      KeyResultCheckIn | KeyResultComment
    >(request)[2]

    const queryResult = await this.core.keyResult.getTimeline(keyResult)

    return this.relay.marshalResponse(queryResult, connection)
  }
}
