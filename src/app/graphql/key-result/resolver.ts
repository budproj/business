import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'
import { uniq } from 'lodash'

import { PERMISSION, POLICY, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import AuthzService from 'src/app/authz/service'
import { ActionPolicies, AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import { KeyResultCommentObject } from 'src/app/graphql/key-result/comment/models'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { TeamObject } from 'src/app/graphql/team/models'
import { UserObject } from 'src/app/graphql/user'
import { DOMAIN_SORTING } from 'src/domain/constants'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResult } from 'src/domain/key-result/entities'
import DomainService from 'src/domain/service'

import { KeyResultCheckInObject } from './check-in/models'
import { KeyResultObject, TimelineEntryUnion } from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultObject)
class GraphQLKeyResultResolver extends GraphQLEntityResolver<KeyResult, KeyResultDTO> {
  private readonly logger = new Logger(GraphQLKeyResultResolver.name)

  constructor(
    protected readonly domain: DomainService,
    protected readonly authzService: AuthzService,
  ) {
    super(RESOURCE.KEY_RESULT, domain, domain.keyResult, authzService)
  }

  @Permissions(PERMISSION['KEY_RESULT:READ'])
  @Query(() => KeyResultObject, { name: 'keyResult' })
  protected async getKeyResult(
    @Args('id', { type: () => ID }) id: KeyResultObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching key result with id ${id}`)

    const keyResult = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!keyResult) throw new UserInputError(`We could not found a key result with id ${id}`)

    return keyResult
  }

  @ResolveField('owner', () => UserObject)
  protected async getKeyResultOwner(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching owner for key result',
    })

    return this.domain.user.getOne({ id: keyResult.ownerId })
  }

  @ResolveField('team', () => TeamObject)
  protected async getKeyResultTeam(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching team for key result',
    })

    const team = await this.domain.team.getOne({ id: keyResult.teamId })

    return team
  }

  @ResolveField('objective', () => ObjectiveObject)
  protected async getKeyResultObjective(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching objective for key result',
    })

    return this.domain.objective.getFromKeyResult(keyResult)
  }

  @ResolveField('keyResultCheckIns', () => [KeyResultCheckInObject], { nullable: true })
  protected async getKeyResultCheckIns(
    @Parent() keyResult: KeyResultObject,
    @Args('order', { type: () => DOMAIN_SORTING, defaultValue: DOMAIN_SORTING.DESC })
    order: DOMAIN_SORTING,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    this.logger.log({
      keyResult,
      limit,
      order,
      message: 'Fetching check-ins for key result',
    })

    const options = {
      limit,
      orderBy: {
        createdAt: order,
      },
    }

    return this.domain.keyResult.getCheckIns(keyResult, options)
  }

  @ResolveField('keyResultComments', () => [KeyResultCommentObject])
  protected async getKeyResultComments(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching comments for key result',
    })

    return this.domain.keyResult.getComments(keyResult)
  }

  @ResolveField('timeline', () => [TimelineEntryUnion])
  protected async getKeyResultTimeline(
    @Parent() keyResult: KeyResultObject,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ) {
    this.logger.log({
      keyResult,
      limit,
      offset,
      message: 'Fetching timeline for key result',
    })

    const options = {
      limit,
      offset,
    }

    return this.domain.keyResult.getTimeline(keyResult, options)
  }

  @ResolveField('latestKeyResultCheckIn', () => KeyResultCheckInObject, { nullable: true })
  protected async getLatestKeyResultCheckIn(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching latest key result check-in for key result',
    })

    return this.domain.keyResult.getLatestCheckInForKeyResultAtDate(keyResult)
  }

  @ResolveField('isOutdated', () => Boolean)
  protected async getIsOutdatedFlag(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Deciding if the given key result is outdated',
    })

    const objective = await this.domain.objective.getFromKeyResult(keyResult)
    const cycle = await this.domain.cycle.getFromObjective(objective)
    const latestKeyResultCheckIn = await this.domain.keyResult.getLatestCheckInForKeyResultAtDate(
      keyResult,
    )

    const enhancedObjective = {
      ...objective,
      cycle,
    }

    const enhancedKeyResult = {
      ...keyResult,
      objective: enhancedObjective,
      checkIns: latestKeyResultCheckIn ? [latestKeyResultCheckIn] : undefined,
    }

    return this.domain.keyResult.specifications.isOutdated.isSatisfiedBy(enhancedKeyResult)
  }

  protected async customizeEntityPolicies(originalPolicies: ActionPolicies, keyResult: KeyResult) {
    const restrictedToActivePolicies = await this.restrictPoliciesToActiveKeyResult(
      originalPolicies,
      keyResult,
    )

    return restrictedToActivePolicies
  }

  private async restrictPoliciesToActiveKeyResult(
    originalPolicies: ActionPolicies,
    keyResult: KeyResult,
  ) {
    const parsedPolicyValues = uniq(Object.values(originalPolicies))
    if (parsedPolicyValues === [POLICY.DENY]) return originalPolicies

    const objective = await this.domain.objective.getFromKeyResult(keyResult)
    const cycle = await this.domain.cycle.getFromObjective(objective)

    return cycle.active ? originalPolicies : this.denyAllPolicies(originalPolicies)
  }
}

export default GraphQLKeyResultResolver
