import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'src/app/authz/constants'
import { AuthzUser } from 'src/app/authz/types'
import GraphQLEntityService from 'src/app/graphql/service'
import { GraphQLTeamsQueryFilters } from 'src/app/graphql/team/types'
import { TeamDTO } from 'src/domain/team/dto'
import { Team } from 'src/domain/team/entities'
import DomainTeamService from 'src/domain/team/service'

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
