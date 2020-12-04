import {
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  PreconditionFailedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import { RailwayError } from 'app/errors'
import { Railway } from 'app/providers'
import { ProgressReport } from 'domain/key-result/report/progress/entities'
import DomainKeyResultService from 'domain/key-result/service'
import DomainUserService from 'domain/user/service'

import { ProgressReportObject, ProgressReportInput } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => ProgressReportObject)
class GraphQLProgressReportResolver {
  private readonly logger = new Logger(GraphQLProgressReportResolver.name)

  constructor(
    private readonly keyResultService: DomainKeyResultService,
    private readonly userService: DomainUserService,
    private readonly railway: Railway,
  ) {}

  @Permissions(PERMISSION['PROGRESS_REPORT:READ'])
  @Query(() => ProgressReportObject)
  async progressReport(
    @Args('id', { type: () => ID }) id: ProgressReportObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching progress report with id ${id.toString()}`)

    const progressReport = await this.keyResultService.report.progress.getOneByIdIfUserIsInCompany(
      id,
      user,
    )
    if (!progressReport)
      throw new NotFoundException(`We could not found a progress report with id ${id}`)

    return progressReport
  }

  @ResolveField()
  async keyResult(@Parent() progressReport: ProgressReportObject) {
    this.logger.log({
      progressReport,
      message: 'Fetching key result for progress report',
    })

    return this.keyResultService.getOneById(progressReport.keyResultId)
  }

  @ResolveField()
  async user(@Parent() progressReport: ProgressReportObject) {
    this.logger.log({
      progressReport,
      message: 'Fetching user for progress report',
    })

    return this.userService.getOneById(progressReport.userId)
  }

  @Permissions(PERMISSION['PROGRESS_REPORT:CREATE'])
  @Mutation(() => ProgressReportObject)
  async createProgressReport(
    @GraphQLUser() user: AuthzUser,
    @Args('progressReportInput', { type: () => ProgressReportInput })
    progressReportInput: ProgressReportInput,
  ) {
    this.logger.log({
      user,
      progressReportInput,
      message: 'Checking if the user owns the given key result',
    })

    const keyResult = await this.keyResultService.getOneById(progressReportInput.keyResultId)
    if (keyResult.ownerId !== user.id) {
      this.logger.log({
        user,
        progressReportInput,
        keyResult,
        message: 'User is not the owner of key result. Dispatching error',
      })
      throw new ForbiddenException(
        'You must be the owner of the key result to create a new progress report',
      )
    }

    this.logger.log({
      user,
      progressReportInput,
      message: 'Creating a new progress report',
    })

    const enhancedWithUserID = {
      userId: user.id,
      keyResultId: progressReportInput.keyResultId,
      comment: progressReportInput.comment,
      valueNew: progressReportInput.value,
    }

    const creationPromise = this.keyResultService.report.progress.create(enhancedWithUserID)
    const [error, createdProgressReport] = await this.railway.handleRailwayPromise<
      RailwayError,
      ProgressReport[]
    >(creationPromise)
    if (error) throw new InternalServerErrorException('Unknown error')
    if (!createdProgressReport)
      throw new PreconditionFailedException('You have already created that report')

    return createdProgressReport[0]
  }
}

export default GraphQLProgressReportResolver
