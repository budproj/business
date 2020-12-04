import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
  PreconditionFailedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { ACTION, PERMISSION } from 'app/authz/constants'
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
import GraphQLProgressReportService from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => ProgressReportObject)
class GraphQLProgressReportResolver {
  private readonly logger = new Logger(GraphQLProgressReportResolver.name)

  constructor(
    private readonly resolverService: GraphQLProgressReportService,
    private readonly keyResultDomain: DomainKeyResultService,
    private readonly userDomain: DomainUserService,
    private readonly railway: Railway,
  ) {}

  @Permissions(PERMISSION['PROGRESS_REPORT:READ'])
  @Query(() => ProgressReportObject)
  async progressReport(
    @Args('id', { type: () => ID }) id: ProgressReportObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching progress report with id ${id.toString()}`)

    const progressReport = await this.resolverService.getOneByIDWithActionScopeConstraint(
      id,
      user,
      ACTION.READ,
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

    return this.keyResultDomain.getOneByID(progressReport.keyResultId)
  }

  @ResolveField()
  async user(@Parent() progressReport: ProgressReportObject) {
    this.logger.log({
      progressReport,
      message: 'Fetching user for progress report',
    })

    return this.userDomain.getOneByID(progressReport.userId)
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

    const keyResult = await this.resolverService.getOneByIDWithActionScopeConstraint(
      progressReportInput.keyResultId,
      user,
      ACTION.CREATE,
    )
    if (keyResult) {
      this.logger.log({
        user,
        progressReportInput,
        keyResult,
        message:
          'User tried to create a check-in in a key resultat that he/she can not see. Either it does not exist, or the user has no permission to see it',
      })
      throw new NotFoundException(
        `We could not found an Key Result with ID ${progressReportInput.keyResultId}`,
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

    const creationPromise = this.keyResultDomain.report.progress.create(enhancedWithUserID)
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
