import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import { ConfidenceReportDTO } from 'domain/key-result-report/confidence/dto'
import KeyResultReportService from 'domain/key-result-report/service'
import KeyResultService from 'domain/key-result/service'
import UserService from 'domain/user/service'

import { ConfidenceReport } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => ConfidenceReport)
class ConfidenceReportResolver {
  private readonly logger = new Logger(ConfidenceReportResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly keyResultReportService: KeyResultReportService,
    private readonly userService: UserService,
  ) {}

  @Permissions('read:confidence-reports')
  @Query(() => ConfidenceReport)
  async confidenceReport(
    @Args('id', { type: () => Int }) id: ConfidenceReportDTO['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching confidence report with id ${id.toString()}`)

    const confidenceReport = await this.keyResultReportService.confidenceReportService.getOneByIdIfUserIsInCompany(
      id,
      user,
    )
    if (!confidenceReport)
      throw new NotFoundException(`We could not found a confidence report with id ${id}`)

    return confidenceReport
  }

  @ResolveField()
  async keyResult(@Parent() confidenceReport: ConfidenceReportDTO) {
    this.logger.log({
      confidenceReport,
      message: 'Fetching key result for confidence report',
    })

    return this.keyResultService.getOneById(confidenceReport.keyResultId)
  }

  @ResolveField()
  async user(@Parent() confidenceReport: ConfidenceReportDTO) {
    this.logger.log({
      confidenceReport,
      message: 'Fetching user for confidence report',
    })

    return this.userService.getOneById(confidenceReport.userId)
  }
}

export default ConfidenceReportResolver
