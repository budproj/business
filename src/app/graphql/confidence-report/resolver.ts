import { Logger, NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { ConfidenceReportDTO } from 'domain/confidence-report/dto'
import ConfidenceReportService from 'domain/confidence-report/service'
import KeyResultService from 'domain/key-result/service'
import UserService from 'domain/user/service'

import { ConfidenceReport } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@Resolver(() => ConfidenceReport)
class ConfidenceReportResolver {
  private readonly logger = new Logger(ConfidenceReportResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly confidenceReportService: ConfidenceReportService,
    private readonly userService: UserService,
  ) {}

  @Permissions('read:confidence-reports')
  @Query(() => ConfidenceReport)
  async confidenceReport(@Args('id', { type: () => Int }) id: ConfidenceReportDTO['id']) {
    this.logger.log(`Fetching confidence report with id ${id.toString()}`)

    const confidenceReport = await this.confidenceReportService.getOneById(id)
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
