import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import { AuthzUser } from 'app/authz/types'
import GraphQLEntityService from 'app/graphql/service'
import { GraphQLTeamsQueryFilters } from 'app/graphql/team/types'
import { TeamDTO } from 'domain/team/dto'
import { Team } from 'domain/team/entities'
import DomainTeamService from 'domain/team/service'

@Injectable()
class GraphQLTeamService extends GraphQLEntityService<Team, TeamDTO> {
  constructor(public readonly teamDomain: DomainTeamService) {
    super(RESOURCE.TEAM, teamDomain)
  }

  async getTeams(filters: GraphQLTeamsQueryFilters, user: AuthzUser) {
    let railway = async () => this.getManyWithActionScopeConstraint(filters, user)
    if (filters.onlyCompanies)
      railway = async () => this.getCompaniesWithActionScopeConstraint(user)
    if (filters.onlyCompaniesAndDepartments)
      railway = async () => this.getCompaniesAndDepartmentsWithActionScopeConstraint(user)

    return railway()
  }

  async getCompaniesWithActionScopeConstraint(user: AuthzUser) {
    const onlyCompaniesSelector = this.teamDomain.buildOnlyCompaniesSelector()
    const selector = { ...onlyCompaniesSelector }
    const companies = await this.getManyWithActionScopeConstraint(selector, user)

    return companies
  }

  async getCompaniesAndDepartmentsWithActionScopeConstraint(user: AuthzUser) {
    const companies = await this.getCompaniesWithActionScopeConstraint(user)
    const departments = await this.teamDomain.getDepartmentsForCompany(companies)

    const companiesAndDepartments = [...companies, ...departments]

    return companiesAndDepartments
  }
}

export default GraphQLTeamService
