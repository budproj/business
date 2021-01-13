import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { ACTION, PERMISSION } from 'src/app/authz/constants'
import { GraphQLUser, Permissions } from 'src/app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'src/app/authz/guards'
import { EnhanceWithBudUser } from 'src/app/authz/interceptors'
import { AuthzUser } from 'src/app/authz/types'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { Railway } from 'src/app/providers'
import { ConfidenceReport } from 'src/domain/key-result/report/confidence/entities'
import { ProgressReport } from 'src/domain/key-result/report/progress/entities'
import DomainKeyResultService from 'src/domain/key-result/service'
import { DuplicateEntityError, RailwayError } from 'src/errors'

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
    if (error instanceof DuplicateEntityError)
      throw new BadRequestException(
        'You have tried to create a duplicate check-in. Please, only create check-ins with new values',
      )
    if (error) throw new InternalServerErrorException('Unknown error')

    return createdReports
  }
}

export default GraphQLKeyResultReportResolver
