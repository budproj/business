import { Logger, NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, PermissionsGuard } from 'app/authz/guards'
import { ConfidenceReportDTO } from 'domain/confidence-report/dto'
import ConfidenceReportService from 'domain/confidence-report/service'
import KeyResultService from 'domain/key-result/service'

import { ConfidenceReport } from './models'

@UseGuards(GraphQLAuthGuard, PermissionsGuard)
@Resolver(() => ConfidenceReport)
class ConfidenceReportResolver {
  private readonly logger = new Logger(ConfidenceReportResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly confidenceReportService: ConfidenceReportService,
  ) {}

  @Permissions('read:confidence-reports')
  @Query(() => ConfidenceReport)
  async confidenceReport(@Args('id', { type: () => Int }) id: ConfidenceReportDTO['id']) {
    this.logger.log(`Fetching confidence report with id ${id.toString()}`)

    const confidenceReport = await this.confidenceReportService.getOneById(id)
    if (!confidenceReport)
      throw new NotFoundException(`Sorry, we could not found a confidence report with id ${id}`)

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
}

export default ConfidenceReportResolver
