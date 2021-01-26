import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import { KeyResultCheckInObject } from 'src/app/graphql/key-result/check-in/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { UserObject } from 'src/app/graphql/user'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import DomainService from 'src/domain/service'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultCheckInObject)
class GraphQLCheckInResolver extends GraphQLEntityResolver<KeyResultCheckIn, KeyResultCheckInDTO> {
  private readonly logger = new Logger(GraphQLCheckInResolver.name)

  constructor(protected readonly domain: DomainService) {
    super(RESOURCE.KEY_RESULT, domain, domain.keyResult.checkIn)
  }

  @Permissions(PERMISSION['KEY_RESULT:READ'])
  @Query(() => KeyResultCheckInObject, { name: 'keyResultCheckIn' })
  protected async getCheckIn(
    @Args('id', { type: () => ID }) id: KeyResultCheckInObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching key result check-in with id ${id.toString()}`)

    const checkIn = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!checkIn) throw new NotFoundException(`We could not found a check-in with id ${id}`)

    return checkIn
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
  //
  //
  // @Permissions(PERMISSION['PROGRESS_REPORT:CREATE'])
  // @Mutation(() => KeyResultCheckInObject)
  // async createCheckIn(
  //   @GraphQLUser() user: AuthzUser,
  //   @Args('checkInInput', { type: () => CheckInInput })
  //   checkInInput: CheckInInput,
  // ) {
  //   this.logger.log({
  //     user,
  //     checkInInput,
  //     message: 'Creating a new check-in',
  //   })
  //
  //   const enhancedWithUserID = {
  //     userId: user.id,
  //     keyResultId: checkInInput.keyResultId,
  //     comment: checkInInput.comment,
  //     valueNew: checkInInput.value,
  //   }
  //
  //   const creationPromise = this.resolverService.createWithScopeConstraint(enhancedWithUserID, user)
  //   const [error, createdCheckIn] = await this.railway.handleRailwayPromise<
  //     RailwayError,
  //     CheckIn[]
  //   >(creationPromise)
  //   console.log(error)
  //   if (error.code === DuplicateEntityError.code)
  //     throw new PreconditionFailedException('You have already created that report')
  //   if (error) throw new InternalServerErrorException('Unknown error')
  //   if (!createdCheckIn)
  //     throw new NotFoundException(
  //       `We could not found a key result with ID ${checkInInput.keyResultId} to add your report`,
  //     )
  //
  //   return createdCheckIn[0]
  // }
}

export default GraphQLCheckInResolver
