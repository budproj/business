import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { ACTION, PERMISSION } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import { RailwayError } from 'app/errors'
import { KeyResultObject } from 'app/graphql/key-result/models'
import { Railway } from 'app/providers'
import { ConfidenceReport } from 'domain/key-result/report/confidence/entities'
import { ProgressReport } from 'domain/key-result/report/progress/entities'
import DomainKeyResultService from 'domain/key-result/service'

import { CheckInInput, ReportObject } from './models'
import GraphQLKeyResultReportService from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultObject)
class GraphQLKeyResultReportResolver {
  private readonly logger = new Logger(GraphQLKeyResultReportResolver.name)

  constructor(
    private readonly resolverService: GraphQLKeyResultReportService,
    private readonly keyResultService: DomainKeyResultService,
    private readonly railway: Railway,
  ) {}

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

    const keyResult = await this.resolverService.getOneByIDWithActionScopeConstraint(
      checkInInput.keyResultId,
      user,
      ACTION.CREATE,
    )
    if (!keyResult) {
      this.logger.log({
        user,
        checkInInput,
        keyResult,
        message:
          'User tried to create a check-in in a key resultat that he/she can not see. Either it does not exist, or the user has no permission to see it',
      })
      throw new NotFoundException(
        `We could not found an Key Result with ID ${checkInInput.keyResultId}`,
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

    const creationPromise = this.keyResultService.report.checkIn(progressReport, confidenceReport)
    const [error, createdReports] = await this.railway.handleRailwayPromise<
      RailwayError,
      Array<ProgressReport | ConfidenceReport>
    >(creationPromise)
    if (error) throw new InternalServerErrorException('Unknown error')

    return createdReports
  }
}

export default GraphQLKeyResultReportResolver
