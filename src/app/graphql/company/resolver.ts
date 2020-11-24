import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { CompanyDTO } from 'domain/company/dto'
import CompanyService from 'domain/company/service'
import CycleService from 'domain/cycle/service'
import TeamService from 'domain/team/service'

import { Company } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => Company)
class CompanyResolver {
  private readonly logger = new Logger(CompanyResolver.name)

  constructor(
    private readonly companyService: CompanyService,
    private readonly teamService: TeamService,
    private readonly cycleService: CycleService,
  ) {}

  @Permissions('read:companies')
  @Query(() => Company)
  async company(@Args('id', { type: () => Int }) id: CompanyDTO['id']) {
    this.logger.log(`Fetching company with id ${id.toString()}`)

    const company = await this.companyService.getOneById(id)
    if (!company) throw new NotFoundException(`We could not found a company with id ${id}`)

    return company
  }

  @ResolveField()
  async teams(@Parent() company: CompanyDTO) {
    this.logger.log({
      company,
      message: 'Fetching teams for company',
    })

    return this.teamService.getFromCompany(company.id)
  }

  @ResolveField()
  async cycles(@Parent() company: CompanyDTO) {
    this.logger.log({
      company,
      message: 'Fetching cycles for company',
    })

    return this.cycleService.getFromCompany(company.id)
  }
}

export default CompanyResolver
