import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainCompanyService from 'domain/company/service'
import DomainCycleService from 'domain/cycle/service'
import DomainTeamService from 'domain/team/service'
import DomainUserService from 'domain/user/service'

import { CompanyObject } from './models'
import GraphQLCompanyService from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => CompanyObject)
class GraphQLCompanyResolver {
  private readonly logger = new Logger(GraphQLCompanyResolver.name)

  constructor(
    private readonly resolverService: GraphQLCompanyService,
    private readonly teamDomain: DomainTeamService,
    private readonly cycleDomain: DomainCycleService,
    private readonly userDomain: DomainUserService,
    private readonly companyDomain: DomainCompanyService,
  ) {}

  @Permissions(PERMISSION['COMPANY:READ'])
  @Query(() => CompanyObject)
  async company(
    @Args('id', { type: () => ID }) id: CompanyObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    const company = await this.resolverService.getOneWithActionScopeConstraint({ id }, user)
    if (!company) throw new NotFoundException(`We could not found a company with id ${id}`)

    return company
  }

  @Permissions(PERMISSION['TEAM:READ'])
  @Query(() => [CompanyObject], { nullable: true })
  async companies(@GraphQLUser() user: AuthzUser) {
    this.logger.log('Fetching user companies')

    const companies = await this.resolverService.getManyWithActionScopeConstraint({}, user)

    return companies
  }

  @ResolveField()
  async teams(@Parent() company: CompanyObject) {
    this.logger.log({
      company,
      message: 'Fetching teams for company',
    })

    return this.teamDomain.getFromCompany(company.id)
  }

  @ResolveField()
  async cycles(@Parent() company: CompanyObject) {
    this.logger.log({
      company,
      message: 'Fetching cycles for company',
    })

    return this.cycleDomain.getFromCompany(company.id)
  }

  @ResolveField()
  async owner(@Parent() company: CompanyObject) {
    this.logger.log({
      company,
      message: 'Fetching owner for company',
    })

    return this.userDomain.getOne({ id: company.ownerId })
  }

  @ResolveField()
  async currentProgress(@Parent() company: CompanyObject) {
    this.logger.log({
      company,
      message: 'Fetching current progress for company',
    })

    return this.companyDomain.getCurrentProgress(company.id)
  }

  @ResolveField()
  async currentConfidence(@Parent() company: CompanyObject) {
    this.logger.log({
      company,
      message: 'Fetching current confidence for company',
    })

    return this.companyDomain.getCurrentConfidence(company.id)
  }
}

export default GraphQLCompanyResolver
