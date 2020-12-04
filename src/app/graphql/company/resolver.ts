import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSIONS } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainCompanyService from 'domain/company/service'
import DomainCycleService from 'domain/cycle/service'
import DomainTeamService from 'domain/team/service'
import DomainUserService from 'domain/user/service'

import { CompanyObject } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => CompanyObject)
class GraphQLCompanyResolver {
  private readonly logger = new Logger(GraphQLCompanyResolver.name)

  constructor(
    private readonly companyService: DomainCompanyService,
    private readonly teamService: DomainTeamService,
    private readonly cycleService: DomainCycleService,
    private readonly userService: DomainUserService,
  ) {}

  @Permissions(PERMISSIONS['COMPANY:READ'])
  @Query(() => CompanyObject)
  async company(
    @Args('id', { type: () => ID }) id: CompanyObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    const userCompanies = await this.userService.parseRequestUserCompanies(user)

    if (!userCompanies.includes(id))
      throw new NotFoundException(`We could not found a company with id ${id}`)
    this.logger.log(`Fetching company with id ${id.toString()}`)

    const company = await this.companyService.getOneById(id)
    if (!company) throw new NotFoundException(`We could not found a company with id ${id}`)

    return company
  }

  @ResolveField()
  async teams(@Parent() company: CompanyObject) {
    this.logger.log({
      company,
      message: 'Fetching teams for company',
    })

    return this.teamService.getFromCompany(company.id)
  }

  @ResolveField()
  async cycles(@Parent() company: CompanyObject) {
    this.logger.log({
      company,
      message: 'Fetching cycles for company',
    })

    return this.cycleService.getFromCompany(company.id)
  }
}

export default GraphQLCompanyResolver
