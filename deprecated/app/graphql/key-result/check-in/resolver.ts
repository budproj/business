import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import {
  Args,
  Float,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { UserInputError, ApolloError } from 'apollo-server-fastify'
import { uniq } from 'lodash'

import { ACTION, PERMISSION, POLICY, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import AuthzService from 'src/app/authz/service'
import { ActionPolicies, AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { UserObject } from 'src/app/graphql/user'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import DomainService from 'src/domain/service'
import RailwayProvider from 'src/railway'

import {
  KeyResultCheckInDeleteResultObject,
  KeyResultCheckInInput,
  KeyResultCheckInObject,
} from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultCheckInObject)
class GraphQLCheckInResolver extends GraphQLEntityResolver<KeyResultCheckIn, KeyResultCheckInDTO> {
  private readonly logger = new Logger(GraphQLCheckInResolver.name)

  constructor(
    protected readonly domain: DomainService,
    protected readonly authzService: AuthzService,
    private readonly railway: RailwayProvider,
  ) {
    super(RESOURCE.KEY_RESULT_CHECK_IN, domain, domain.keyResult.checkIn, authzService)
  }

  @Permissions(PERMISSION['KEY_RESULT_CHECK_IN:READ'])
  @Query(() => KeyResultCheckInObject, { name: 'keyResultCheckIn' })
  protected async getCheckIn(
    @Args('id', { type: () => ID }) id: KeyResultCheckInObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching key result check-in with id ${id}`)

    const checkIn = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!checkIn) throw new UserInputError(`We could not found a check-in with id ${id}`)

    return checkIn
  }

  @Permissions(PERMISSION['KEY_RESULT_CHECK_IN:CREATE'])
  @Mutation(() => KeyResultCheckInObject, { name: 'createKeyResultCheckIn' })
  protected async createKeyResultCheckIn(
    @GraphQLUser() user: AuthzUser,
    @Args('keyResultCheckIn', { type: () => KeyResultCheckInInput })
    keyResultCheckIn: KeyResultCheckInInput,
  ) {
    this.logger.log({
      user,
      keyResultCheckIn,
      message: 'Received create check-in request',
    })

    const keyResult = await this.domain.keyResult.getOne({ id: keyResultCheckIn.keyResultId })
    const objective = await this.domain.objective.getFromKeyResult(keyResult)
    const cycle = await this.domain.cycle.getFromObjective(objective)
    if (!cycle.active)
      throw new UserInputError(
        'You cannot create this check-in, because that cycle is not active anymore',
      )

    const checkIn = await this.domain.keyResult.buildCheckInForUser(user, keyResultCheckIn)
    const createCheckInPromise = this.createWithActionScopeConstraint(checkIn, user, ACTION.UPDATE)

    this.logger.log({
      user,
      checkIn,
      message: 'Creating a new check-in in our database',
    })

    const [error, createdCheckIns] = await this.railway.execute<KeyResultCheckIn[]>(
      createCheckInPromise,
    )
    if (error) throw new ApolloError(error.message)
    if (!createdCheckIns || createdCheckIns.length === 0)
      throw new UserInputError(
        `We could not find any key result with ID ${keyResultCheckIn.keyResultId} to add your check-in`,
      )

    const createdCheckIn = createdCheckIns[0]

    return createdCheckIn
  }

  @Permissions(PERMISSION['KEY_RESULT_CHECK_IN:DELETE'])
  @Mutation(() => KeyResultCheckInDeleteResultObject, { name: 'deleteKeyResultCheckIn' })
  protected async deleteKeyResultCheckIn(
    @GraphQLUser() user: AuthzUser,
    @Args('id', { type: () => ID }) keyResultCheckInID: KeyResultCheckIn['id'],
  ) {
    this.logger.log({
      user,
      keyResultCheckInID,
      message: 'Removing key result check-in',
    })

    const keyResult = await this.domain.keyResult.getFromKeyResultCheckInID(keyResultCheckInID)
    const objective = await this.domain.objective.getFromKeyResult(keyResult)
    const cycle = await this.domain.cycle.getFromObjective(objective)
    if (!cycle.active)
      throw new UserInputError(
        'You cannot delete this check-in, because that cycle is not active anymore',
      )

    const selector = { id: keyResultCheckInID }
    const result = await this.deleteWithActionScopeConstraint(selector, user)
    if (!result)
      throw new UserInputError(
        `We could not find any key result check-in with ${keyResultCheckInID} to delete`,
      )

    return result
  }

  @ResolveField('user', () => UserObject)
  protected async getKeyResultCheckInUser(@Parent() checkIn: KeyResultCheckInObject) {
    this.logger.log({
      checkIn,
      message: 'Fetching user for key result check-in',
    })

    return this.domain.user.getOne({ id: checkIn.userId })
  }

  @ResolveField('keyResult', () => KeyResultObject)
  protected async getKeyResultCheckInKeyResult(@Parent() checkIn: KeyResultCheckInObject) {
    this.logger.log({
      checkIn,
      message: 'Fetching key result for key result check-in',
    })

    return this.domain.keyResult.getOne({ id: checkIn.keyResultId })
  }

  @ResolveField('parent', () => KeyResultCheckInObject, { nullable: true })
  protected async getKeyResultCheckInParent(@Parent() checkIn: KeyResultCheckInObject) {
    this.logger.log({
      checkIn,
      message: 'Fetching parent for key result check-in',
    })

    return this.domain.keyResult.getParentCheckInFromCheckIn(checkIn)
  }

  @ResolveField('progressIncrease', () => Float)
  protected async getKeyResultCheckInPercentageProgressIncrease(
    @Parent() checkIn: KeyResultCheckInObject,
  ) {
    this.logger.log({
      checkIn,
      message: 'Fetching percentage progress increase for key result check-in',
    })

    return this.domain.keyResult.getCheckInProgressIncrease(checkIn)
  }

  @ResolveField('confidenceIncrease', () => Int)
  protected async getKeyResultCheckInAbsoluteConfidenceIncrease(
    @Parent() checkIn: KeyResultCheckInObject,
  ) {
    this.logger.log({
      checkIn,
      message: 'Fetching absolute confidence increase for key result check-in',
    })

    return this.domain.keyResult.getCheckInConfidenceIncrease(checkIn)
  }

  @ResolveField('progress', () => Float)
  protected async getKeyResultCheckInProgress(@Parent() checkIn: KeyResultCheckInObject) {
    this.logger.log({
      checkIn,
      message: 'Fetching relative percentage progress for key result check-in',
    })

    return this.domain.keyResult.getCheckInProgress(checkIn)
  }

  @ResolveField('valueIncrease', () => Float)
  protected async getKeyResultCheckInValueIncrease(@Parent() checkIn: KeyResultCheckInObject) {
    this.logger.log({
      checkIn,
      message: 'Fetching value increase for key result check-in',
    })

    return this.domain.keyResult.getCheckInValueIncrease(checkIn)
  }

  protected async customizeEntityPolicies(
    originalPolicies: ActionPolicies,
    keyResultCheckIn: KeyResultCheckIn,
  ) {
    const restrictedToActivePolicies = await this.restrictPoliciesToActiveKeyResult(
      originalPolicies,
      keyResultCheckIn,
    )
    const restrictedDeletionToLatestCheckIn = await this.restrictDeletePolicyToAllowOnlyLatestCheckIn(
      restrictedToActivePolicies,
      keyResultCheckIn,
    )

    return restrictedDeletionToLatestCheckIn
  }

  private async restrictPoliciesToActiveKeyResult(
    originalPolicies: ActionPolicies,
    keyResultCheckIn: KeyResultCheckIn,
  ) {
    const parsedPolicyValues = uniq(Object.values(originalPolicies))
    if (parsedPolicyValues === [POLICY.DENY]) return originalPolicies

    const keyResult = await this.domain.keyResult.getOne({ id: keyResultCheckIn.keyResultId })
    const objective = await this.domain.objective.getFromKeyResult(keyResult)
    const cycle = await this.domain.cycle.getFromObjective(objective)

    return cycle.active ? originalPolicies : this.denyAllPolicies(originalPolicies)
  }

  private async restrictDeletePolicyToAllowOnlyLatestCheckIn(
    originalPolicies: ActionPolicies,
    keyResultCheckIn: KeyResultCheckIn,
  ) {
    const keyResult = await this.domain.keyResult.getOne({ id: keyResultCheckIn.keyResultId })
    const latestCheckIn = await this.domain.keyResult.getLatestCheckInForKeyResultAtDate(keyResult)

    const updatedDeletePolicy =
      latestCheckIn.id === keyResultCheckIn.id ? POLICY.ALLOW : POLICY.DENY
    const shouldUpdateDeletePolicy = originalPolicies.delete === POLICY.ALLOW

    const policies: ActionPolicies = {
      ...originalPolicies,
      [ACTION.DELETE]: shouldUpdateDeletePolicy ? updatedDeletePolicy : originalPolicies.delete,
    }

    return policies
  }
}

export default GraphQLCheckInResolver
