import { Logger, NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, PermissionsGuard } from 'app/authz/guards'
import KeyResultService from 'domain/key-result/service'
import { ProgressReportDTO } from 'domain/progress-report/dto'
import ProgressReportService from 'domain/progress-report/service'

import { ProgressReport } from './models'

@UseGuards(GraphQLAuthGuard, PermissionsGuard)
@Resolver(() => ProgressReport)
class ProgressReportResolver {
  private readonly logger = new Logger(ProgressReportResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly progressReportService: ProgressReportService,
  ) {}

  @Permissions('read:progress-reports')
  @Query(() => ProgressReport)
  async progressReport(@Args('id', { type: () => Int }) id: ProgressReportDTO['id']) {
    this.logger.log(`Fetching progress report with id ${id.toString()}`)

    const progressReport = await this.progressReportService.getOneById(id)
    if (!progressReport)
      throw new NotFoundException(`Sorry, we could not found a progress report with id ${id}`)

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
}

export default ProgressReportResolver
