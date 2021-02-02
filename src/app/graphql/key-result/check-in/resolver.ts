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

import { ACTION, PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import {
  KeyResultCheckInInput,
  KeyResultCheckInObject,
} from 'src/app/graphql/key-result/check-in/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { UserObject } from 'src/app/graphql/user'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import DomainService from 'src/domain/service'
import RailwayProvider from 'src/railway'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultCheckInObject)
class GraphQLCheckInResolver extends GraphQLEntityResolver<KeyResultCheckIn, KeyResultCheckInDTO> {
  private readonly logger = new Logger(GraphQLCheckInResolver.name)

  constructor(protected readonly domain: DomainService, private readonly railway: RailwayProvider) {
    super(RESOURCE.KEY_RESULT_CHECK_IN, domain, domain.keyResult.checkIn)
  }

  @Permissions(PERMISSION['KEY_RESULT_CHECK_IN:READ'])
  @Query(() => KeyResultCheckInObject, { name: 'keyResultCheckIn' })
  protected async getCheckIn(
    @Args('id', { type: () => ID }) id: KeyResultCheckInObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching key result check-in with id ${id.toString()}`)

    const checkIn = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!checkIn) throw new UserInputError(`We could not found a check-in with id ${id}`)

    return checkIn
  }

  @Permissions(PERMISSION['KEY_RESULT_CHECK_IN:UPDATE'])
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

  @ResolveField('percentageProgressIncrease', () => Float)
  protected async getKeyResultCheckInPercentageProgressIncrease(
    @Parent() checkIn: KeyResultCheckInObject,
  ) {
    this.logger.log({
      checkIn,
      message: 'Fetching percentage progress increase for key result check-in',
    })

    return this.domain.keyResult.getCheckInPercentageProgressIncrease(checkIn)
  }

  @ResolveField('absoluteConfidenceIncrease', () => Int)
  protected async getKeyResultCheckInAbsoluteConfidenceIncrease(
    @Parent() checkIn: KeyResultCheckInObject,
  ) {
    this.logger.log({
      checkIn,
      message: 'Fetching absolute confidence increase for key result check-in',
    })

    return this.domain.keyResult.getCheckInAbsoluteConfidenceIncrease(checkIn)
  }

  @ResolveField('relativePercentageProgress', () => Float)
  protected async getKeyResultCheckInRelativePercentageProgress(
    @Parent() checkIn: KeyResultCheckInObject,
  ) {
    this.logger.log({
      checkIn,
      message: 'Fetching relative percentage progress for key result check-in',
    })

    return this.domain.keyResult.getCheckInRelativePercentageProgress(checkIn)
  }
}

export default GraphQLCheckInResolver
