import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Query, Resolver } from '@nestjs/graphql'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import { CheckInObject } from 'src/app/graphql/key-result/check-in/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import DomainService from 'src/domain/service'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => CheckInObject)
class GraphQLCheckInResolver extends GraphQLEntityResolver<KeyResultCheckIn, KeyResultCheckInDTO> {
  private readonly logger = new Logger(GraphQLCheckInResolver.name)

  constructor(protected readonly domain: DomainService) {
    super(RESOURCE.KEY_RESULT, domain, domain.keyResult.checkIn)
  }

  @Permissions(PERMISSION['KEY_RESULT:READ'])
  @Query(() => CheckInObject, { name: 'checkIn' })
  protected async getCheckIn(
    @Args('id', { type: () => ID }) id: CheckInObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching key result check-in with id ${id.toString()}`)

    const checkIn = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!checkIn) throw new NotFoundException(`We could not found a check-in with id ${id}`)

    return checkIn
  }
  //
  // @ResolveField()
  // async keyResult(@Parent() checkIn: CheckInObject) {
  //   this.logger.log({
  //     checkIn,
  //     message: 'Fetching key result for check-in',
  //   })
  //
  //   return this.keyResultDomain.getOne({ id: checkIn.keyResultId })
  // }
  //
  // @ResolveField()
  // async user(@Parent() checkIn: CheckInObject) {
  //   this.logger.log({
  //     checkIn,
  //     message: 'Fetching user for check-in',
  //   })
  //
  //   return this.userDomain.getOne({ id: checkIn.userId })
  // }
  //
  // @Permissions(PERMISSION['PROGRESS_REPORT:CREATE'])
  // @Mutation(() => CheckInObject)
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
