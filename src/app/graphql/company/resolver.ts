import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainCycleService from 'domain/cycle/service'
import DomainTeamService from 'domain/team/service'

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
  ) {}

  @Permissions(PERMISSION['COMPANY:READ'])
  @Query(() => CompanyObject)
  async company(
    @Args('id', { type: () => ID }) id: CompanyObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    const company = await this.resolverService.getOneByIDWithScopeConstraint(id, user)
    if (!company) throw new NotFoundException(`We could not found a company with id ${id}`)

    return company
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
}

export default GraphQLCompanyResolver
