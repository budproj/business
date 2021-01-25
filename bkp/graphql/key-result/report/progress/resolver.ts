import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
  PreconditionFailedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION } from 'src/app/authz/constants'
import { GraphQLUser, Permissions } from 'src/app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'src/app/authz/guards'
import { EnhanceWithBudUser } from 'src/app/authz/interceptors'
import { AuthzUser } from 'src/app/authz/types'
import { Railway } from 'src/app/providers'
import { ProgressReport } from 'src/domain/key-result/report/progress/entities'
import DomainKeyResultService from 'src/domain/key-result/service'
import DomainUserService from 'src/domain/user/service'
import { DuplicateEntityError, RailwayError } from 'src/errors'

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

    const progressReport = await this.resolverService.getOneWithActionScopeConstraint({ id }, user)
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

    return this.keyResultDomain.getOne({ id: progressReport.keyResultId })
  }

  @ResolveField()
  async user(@Parent() progressReport: ProgressReportObject) {
    this.logger.log({
      progressReport,
      message: 'Fetching user for progress report',
    })

    return this.userDomain.getOne({ id: progressReport.userId })
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
      message: 'Creating a new progress report',
    })

    const enhancedWithUserID = {
      userId: user.id,
      keyResultId: progressReportInput.keyResultId,
      comment: progressReportInput.comment,
      valueNew: progressReportInput.value,
    }

    const creationPromise = this.resolverService.createWithScopeConstraint(enhancedWithUserID, user)
    const [error, createdProgressReport] = await this.railway.handleRailwayPromise<
      RailwayError,
      ProgressReport[]
    >(creationPromise)
    console.log(error)
    if (error.code === DuplicateEntityError.code)
      throw new PreconditionFailedException('You have already created that report')
    if (error) throw new InternalServerErrorException('Unknown error')
    if (!createdProgressReport)
      throw new NotFoundException(
        `We could not found a key result with ID ${progressReportInput.keyResultId} to add your report`,
      )

    return createdProgressReport[0]
  }
}

export default GraphQLProgressReportResolver
