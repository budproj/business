import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainKeyResultService from 'domain/key-result/service'
import DomainUserService from 'domain/user/service'

import { ConfidenceReportObject } from './models'
import GraphQLConfidenceReportService from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => ConfidenceReportObject)
class GraphQLConfidenceReportResolver {
  private readonly logger = new Logger(GraphQLConfidenceReportResolver.name)

  constructor(
    private readonly resolverService: GraphQLConfidenceReportService,
    private readonly keyResultDomain: DomainKeyResultService,
    private readonly userDomain: DomainUserService,
  ) {}

  @Permissions(PERMISSION['CONFIDENCE_REPORT:READ'])
  @Query(() => ConfidenceReportObject)
  async confidenceReport(
    @Args('id', { type: () => ID }) id: ConfidenceReportObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching confidence report with id ${id.toString()}`)

    const confidenceReport = await this.resolverService.getOneByIDWithActionScopeConstraint(
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

    return this.keyResultDomain.getOneByID(confidenceReport.keyResultId)
  }

  @ResolveField()
  async user(@Parent() confidenceReport: ConfidenceReportObject) {
    this.logger.log({
      confidenceReport,
      message: 'Fetching user for confidence report',
    })

    return this.userDomain.getOneByID(confidenceReport.userId)
  }
}

export default GraphQLConfidenceReportResolver
