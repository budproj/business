import {
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

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

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultObject)
class GraphQLKeyResultReportResolver {
  private readonly logger = new Logger(GraphQLKeyResultReportResolver.name)

  constructor(
    private readonly keyResultService: DomainKeyResultService,
    private readonly railway: Railway,
  ) {}

  @Permissions('create:progress-reports', 'create:confidence-reports')
  @Mutation(() => [ReportObject])
  async checkIn(
    @GraphQLUser() user: AuthzUser,
    @Args('checkInInput', { type: () => CheckInInput })
    checkInInput: CheckInInput,
  ) {
    this.logger.log({
      user,
      checkInInput,
      message: 'Checking if the user owns the given key result',
    })

    const keyResult = await this.keyResultService.getOneById(checkInInput.keyResultId)
    if (keyResult.ownerId !== user.id) {
      this.logger.log({
        user,
        checkInInput,
        keyResult,
        message: 'User is not the owner of key result. Dispatching error',
      })
      throw new ForbiddenException(
        'You must be the owner of the key result to create a new check-in',
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
