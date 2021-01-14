import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { ACTION, PERMISSION } from 'src/app/authz/constants'
import { GraphQLUser, Permissions } from 'src/app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'src/app/authz/guards'
import { EnhanceWithBudUser } from 'src/app/authz/interceptors'
import { AuthzUser } from 'src/app/authz/types'
import { Railway } from 'src/app/providers'
import { ConfidenceReport } from 'src/domain/key-result/report/confidence/entities'
import { ProgressReport } from 'src/domain/key-result/report/progress/entities'
import DomainKeyResultService from 'src/domain/key-result/service'
import DomainUserService from 'src/domain/user/service'
import { DuplicateEntityError, RailwayError } from 'src/errors'

import { ConfidenceReportObject } from './confidence/models'
import { CheckInInput, ReportObject } from './models'
import { ProgressReportObject } from './progress/models'
import GraphQLKeyResultReportService from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => ReportObject)
class GraphQLKeyResultReportResolver {
  private readonly logger = new Logger(GraphQLKeyResultReportResolver.name)

  constructor(
    private readonly resolverService: GraphQLKeyResultReportService,
    private readonly keyResultDomain: DomainKeyResultService,
    private readonly userDomain: DomainUserService,
    private readonly railway: Railway,
  ) {}

  @Permissions(PERMISSION['PROGRESS_REPORT:CREATE'], PERMISSION['CONFIDENCE_REPORT:CREATE'])
  @Query(() => ReportObject)
  async report(
    @Args('id', { type: () => ID }) id: ProgressReport['id'] | ConfidenceReport['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching report with id ${id.toString()}`)

    const report = await this.resolverService.getOneReportWithActionScopeConstraint({ id }, user)
    if (!report) throw new NotFoundException(`We could not found a report with id ${id}`)

    return report
  }

  @ResolveField()
  async keyResult(@Parent() report: ProgressReportObject | ConfidenceReportObject) {
    this.logger.log({
      report,
      message: 'Fetching key result for report',
    })

    return this.keyResultDomain.getOne({ id: report.keyResultId })
  }

  @ResolveField()
  async user(@Parent() report: ProgressReportObject | ConfidenceReportObject) {
    this.logger.log({
      report,
      message: 'Fetching user for report',
    })

    return this.userDomain.getOne({ id: report.userId })
  }

  @Permissions(PERMISSION['PROGRESS_REPORT:CREATE'], PERMISSION['CONFIDENCE_REPORT:CREATE'])
  @Mutation(() => [ReportObject])
  async createCheckIn(
    @GraphQLUser() user: AuthzUser,
    @Args('checkInInput', { type: () => CheckInInput })
    checkInInput: CheckInInput,
  ) {
    this.logger.log({
      user,
      checkInInput,
      message: 'Checking if the user owns the given key result',
    })

    const keyResult = await this.resolverService.getOneWithActionScopeConstraint(
      { id: checkInInput.keyResultId },
      user,
      ACTION.CREATE,
    )
    if (!keyResult) {
      this.logger.log({
        user,
        checkInInput,
        keyResult,
        message:
          'User tried to create a check-in in a key result that he/she can not see. Either it does not exist, or the user has no permission to see it',
      })
      throw new NotFoundException(
        `We could not found a Key Result with ID ${checkInInput.keyResultId}`,
      )
    }

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

    const creationPromise = this.keyResultDomain.report.checkIn(progressReport, confidenceReport)
    const [error, createdReports] = await this.railway.handleRailwayPromise<
      RailwayError,
      Array<ProgressReport | ConfidenceReport>
    >(creationPromise)
    if (error instanceof DuplicateEntityError)
      throw new BadRequestException(
        'You have tried to create a duplicate check-in. Please, only create check-ins with new values',
      )
    if (error) throw new InternalServerErrorException('Unknown error')

    return createdReports
  }
}

export default GraphQLKeyResultReportResolver
