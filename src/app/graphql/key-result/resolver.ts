import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import { RailwayError } from 'app/errors'
import { Railway } from 'app/providers'
import { ConfidenceReport as ConfidenceReportEntity } from 'domain/key-result-report/confidence/entities'
import { ProgressReport as ProgressReportEntity } from 'domain/key-result-report/progress/entities'
import KeyResultReportService from 'domain/key-result-report/service'
import { KeyResultDTO } from 'domain/key-result/dto'
import KeyResultService from 'domain/key-result/service'
import ObjectiveService from 'domain/objective/service'
import TeamService from 'domain/team/service'
import UserService from 'domain/user/service'

import { CheckInInput, KeyResult, Report } from './models'
import { CheckIn } from './types'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResult)
class KeyResultResolver {
  private readonly logger = new Logger(KeyResultResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly userService: UserService,
    private readonly objectiveService: ObjectiveService,
    private readonly teamService: TeamService,
    private readonly keyResultReportService: KeyResultReportService,
    private readonly railway: Railway,
  ) {}

  @Permissions('read:key-results')
  @Query(() => KeyResult)
  async keyResult(
    @Args('id', { type: () => Int }) id: KeyResultDTO['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching key result with id ${id.toString()}`)

    const keyResult = await this.keyResultService.getOneByIdIfUserIsInCompany(id, user)
    if (!keyResult) throw new NotFoundException(`We could not found a key result with id ${id}`)

    return keyResult
  }

  @ResolveField()
  async owner(@Parent() keyResult: KeyResultDTO) {
    this.logger.log({
      keyResult,
      message: 'Fetching owner for key result',
    })

    return this.userService.getOneById(keyResult.ownerId)
  }

  @ResolveField()
  async objective(@Parent() keyResult: KeyResultDTO) {
    this.logger.log({
      keyResult,
      message: 'Fetching objective for key result',
    })

    return this.objectiveService.getOneById(keyResult.objectiveId)
  }

  @ResolveField()
  async team(@Parent() keyResult: KeyResultDTO) {
    this.logger.log({
      keyResult,
      message: 'Fetching team for key result',
    })

    return this.teamService.getOneById(keyResult.teamId)
  }

  @ResolveField()
  async progressReports(
    @Parent() keyResult: KeyResultDTO,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    this.logger.log({
      keyResult,
      limit,
      message: 'Fetching progress reports for key result',
    })

    return this.keyResultReportService.progressReportService.getFromKeyResult(keyResult.id, {
      limit,
    })
  }

  @ResolveField()
  async confidenceReports(
    @Parent() keyResult: KeyResultDTO,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    this.logger.log({
      keyResult,
      limit,
      message: 'Fetching confidence reports for key result',
    })

    return this.keyResultReportService.confidenceReportService.getFromKeyResult(keyResult.id, {
      limit,
    })
  }

  @Mutation(() => [Report])
  async checkIn(
    @GraphQLUser() user: AuthzUser,
    @Args('checkInInput', { type: () => CheckInInput })
    checkInInput: CheckIn,
  ) {
    this.logger.log({
      user,
      checkInInput,
      message: 'Creating a new check-in',
    })

    const progressReport = {
      valueNew: checkInInput.progress,
      userId: user.id,
      keyResultId: checkInInput.keyResultId,
      comment: checkInInput.comment,
    }
    const confidenceReport = {
      valueNew: checkInInput.confidence,
      userId: user.id,
      keyResultId: checkInInput.keyResultId,
      comment: checkInInput.comment,
    }

    const creationPromise = this.keyResultReportService.checkIn(progressReport, confidenceReport)
    const [error, createdReports] = await this.railway.handleRailwayPromise<
      RailwayError,
      Array<ProgressReportEntity | ConfidenceReportEntity>
    >(creationPromise)
    if (error) throw new InternalServerErrorException('Unknown error')

    return createdReports
  }
}

export default KeyResultResolver
