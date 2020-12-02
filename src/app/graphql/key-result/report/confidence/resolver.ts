import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainKeyResultService from 'domain/key-result/service'
import DomainUserService from 'domain/user/service'

import { ConfidenceReportObject } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => ConfidenceReportObject)
class GraphQLConfidenceReportResolver {
  private readonly logger = new Logger(GraphQLConfidenceReportResolver.name)

  constructor(
    private readonly keyResultService: DomainKeyResultService,
    private readonly userService: DomainUserService,
  ) {}

  @Permissions('read:confidence-reports')
  @Query(() => ConfidenceReportObject)
  async confidenceReport(
    @Args('id', { type: () => Int }) id: ConfidenceReportObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching confidence report with id ${id.toString()}`)

    const confidenceReport = await this.keyResultService.report.confidence.getOneByIdIfUserIsInCompany(
      id,
      user,
    )
    if (!confidenceReport)
      throw new NotFoundException(`We could not found a confidence report with id ${id}`)

    return confidenceReport
  }

  @ResolveField()
  async keyResult(@Parent() confidenceReport: ConfidenceReportObject) {
    this.logger.log({
      confidenceReport,
      message: 'Fetching key result for confidence report',
    })

    return this.keyResultService.getOneById(confidenceReport.keyResultId)
  }

  @ResolveField()
  async user(@Parent() confidenceReport: ConfidenceReportObject) {
    this.logger.log({
      confidenceReport,
      message: 'Fetching user for confidence report',
    })

    return this.userService.getOneById(confidenceReport.userId)
  }
}

export default GraphQLConfidenceReportResolver
