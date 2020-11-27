import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
  PreconditionFailedException,
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
import KeyResultService from 'domain/key-result/service'
import { ProgressReportDTO } from 'domain/progress-report/dto'
import { ProgressReport as ProgressReportEntity } from 'domain/progress-report/entities'
import ProgressReportService from 'domain/progress-report/service'
import UserService from 'domain/user/service'

import { ProgressReport, ProgressReportInput } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => ProgressReport)
class ProgressReportResolver {
  private readonly logger = new Logger(ProgressReportResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly progressReportService: ProgressReportService,
    private readonly userService: UserService,
    private readonly railway: Railway,
  ) {}

  @Permissions('read:progress-reports')
  @Query(() => ProgressReport)
  async progressReport(
    @Args('id', { type: () => Int }) id: ProgressReportDTO['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching progress report with id ${id.toString()}`)

    const progressReport = await this.progressReportService.getOneByIdIfUserIsInCompany(id, user)
    if (!progressReport)
      throw new NotFoundException(`We could not found a progress report with id ${id}`)

    return progressReport
  }

  @ResolveField()
  async keyResult(@Parent() progressReport: ProgressReportDTO) {
    this.logger.log({
      progressReport,
      message: 'Fetching key result for progress report',
    })

    return this.keyResultService.getOneById(progressReport.keyResultId)
  }

  @ResolveField()
  async user(@Parent() progressReport: ProgressReportDTO) {
    this.logger.log({
      progressReport,
      message: 'Fetching user for progress report',
    })

    return this.userService.getOneById(progressReport.userId)
  }

  @Mutation(() => ProgressReport)
  async createProgressReport(
    @GraphQLUser() user: AuthzUser,
    @Args('progressReportInput', { type: () => ProgressReportInput })
    progressReportInput: Partial<ProgressReportDTO>,
  ) {
    this.logger.log({
      user,
      progressReportInput,
      message: 'Creating a new progress report',
    })

    const enhancedWithUserID = {
      ...progressReportInput,
      userId: user.id,
    }

    const creationPromise = this.progressReportService.create(enhancedWithUserID)
    const [error, createdProgressReport] = await this.railway.handleRailwayPromise<
      RailwayError,
      ProgressReportEntity[]
    >(creationPromise)
    if (error) throw new InternalServerErrorException('Unknown error')
    if (!createdProgressReport)
      throw new PreconditionFailedException('You have already created that report')

    return createdProgressReport[0]
  }
}

export default ProgressReportResolver
