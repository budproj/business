import { Injectable } from '@nestjs/common'
import { flatten, remove, uniqBy } from 'lodash'

import { CONSTRAINT } from 'src/domain/constants'
import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { TeamEntityFilter, TeamEntityRelation } from 'src/domain/team/types'
import { UserDTO } from 'src/domain/user/dto'

import { TeamDTO } from './dto'
import { Team } from './entities'
import DomainTeamRepository from './repository'
import DomainTeamSpecification from './specification'

export interface DomainTeamServiceInterface {
  repository: DomainTeamRepository
  specification: DomainTeamSpecification

  getFromOwner: (owner: UserDTO) => Promise<Team[]>
  getUserCompanies: (user: UserDTO) => Promise<Team[]>
  getUserCompaniesAndDepartments: (user: UserDTO) => Promise<Team[]>
  getWithUser: (user: UserDTO) => Promise<Team[]>
  getAllTeamsBelowNodes: (
    nodes: TeamDTO | TeamDTO[],
    filter?: TeamEntityFilter[],
    relations?: TeamEntityRelation[],
  ) => Promise<Array<Partial<Team>>>
  getParentTeam: (team: TeamDTO) => Promise<Team>
  getUsersInTeam: (teamID: TeamDTO) => Promise<UserDTO[]>
  buildTeamQueryContext: (user: UserDTO, constraint: CONSTRAINT) => Promise<DomainQueryContext>
}

@Injectable()
class DomainTeamService
  extends DomainEntityService<Team, TeamDTO>
  implements DomainTeamServiceInterface {
  constructor(
    public readonly repository: DomainTeamRepository,
    public readonly specification: DomainTeamSpecification,
  ) {
    super(repository, DomainTeamService.name)
  }

  public async getFromOwner(owner: UserDTO) {
    return this.repository.find({ ownerId: owner.id })
  }

  public async getUserCompanies(user: UserDTO) {
    const teams = await this.getWithUser(user)
    const companyPromises = teams.map(async (team) => this.getRootTeamForTeam(team))

    const companies = Promise.all(companyPromises)

    return companies
  }

  public async getWithUser(user: UserDTO) {
    const teams = await user.teams

    return teams as Team[]
  }

  public async getAllTeamsBelowNodes(
    nodes: TeamDTO | TeamDTO[],
    filter?: TeamEntityFilter[],
    relations?: TeamEntityRelation[],
  ) {
    const nodesAsArray = Array.isArray(nodes) ? nodes : [nodes]

    let teams: Team[] = await Promise.all(
      nodesAsArray.map(async (team) => this.getOne({ id: team.id })),
    )
    let nextIterationTeams = nodesAsArray

    while (nextIterationTeams.length > 0) {
      // Since we're dealing with a linked list, where we need to evaluate each step before
      // trying the next one, we can disable the following eslint rule
      // eslint-disable-next-line no-await-in-loop
      const selectedTeams = await Promise.all(
        nextIterationTeams.map(async (team) => this.getChildTeams(team, filter, relations)),
      )
      const currentIterationTeams = flatten(selectedTeams)

      teams = [...teams, ...currentIterationTeams]
      nextIterationTeams = remove(currentIterationTeams)
    }

    return teams
  }

  public async getUserCompaniesAndDepartments(user: UserDTO) {
    const companies = await this.getUserCompanies(user)
    const departments = await this.getUserCompaniesDepartments(user)

    return [...companies, ...departments]
  }

  public async getParentTeam(team: TeamDTO) {
    const { parentTeamId } = await this.getOne({ id: team.id })

    return this.getOne({ id: parentTeamId })
  }

  public async getUsersInTeam(team: TeamDTO) {
    const teamsBelowCurrentNode = await this.getAllTeamsBelowNodes(team)

    const teamUsers = await Promise.all(teamsBelowCurrentNode.map(async (team) => team.users))
    const flattenedTeamUsers = flatten(teamUsers)
    const uniqTeamUsers = uniqBy(flattenedTeamUsers, 'id')

    return uniqTeamUsers
  }

  public async buildTeamQueryContext(user: UserDTO, constraint: CONSTRAINT) {
    const context = this.buildContext(user, constraint)

    const userCompanies = await this.parseUserCompanies(user)
    const userCompaniesTeams = await this.parseUserCompaniesTeams(userCompanies)
    const userTeams = await this.getWithUser(user)

    const query = {
      companies: userCompanies,
      teams: userCompaniesTeams,
      userTeams,
    }

    const queryContext = {
      ...context,
      query,
    }

    return queryContext
  }

  protected async createIfUserIsInCompany(_data: Partial<Team>, _queryContext: DomainQueryContext) {
    return {} as any
  }

  protected async createIfUserIsInTeam(_data: Partial<Team>, _queryContext: DomainQueryContext) {
    return {} as any
  }

  protected async createIfUserOwnsIt(_data: Partial<Team>, _queryContext: DomainQueryContext) {
    return {} as any
  }

  private async getRootTeamForTeam(team: TeamDTO) {
    let rootTeam = team as Team

    while (rootTeam.parentTeamId) {
      // Since we're dealing with a linked list, where we need to evaluate each step before trying
      // the next one, we can disable the following eslint rule
      // eslint-disable-next-line no-await-in-loop
      rootTeam = await this.getOne({ id: rootTeam.parentTeamId })
    }

    return rootTeam
  }

  private async getChildTeams(
    teams: TeamDTO | TeamDTO[],
    filter?: TeamEntityFilter[],
    relations?: TeamEntityRelation[],
  ) {
    const teamsAsArray = Array.isArray(teams) ? teams : [teams]
    const whereSelector = teamsAsArray.map((team) => ({
      parentTeamId: team.id,
    }))

    const childTeams = await this.repository.find({
      relations,
      select: filter,
      where: whereSelector,
    })

    return childTeams
  }

  private async getUserCompaniesDepartments(user: UserDTO) {
    const companies = await this.getUserCompanies(user)
    const departments = this.getChildTeams(companies)

    return departments
  }

  private async parseUserCompanies(user: UserDTO) {
    const userCompanies = await this.getUserCompanies(user)

    return userCompanies
  }

  private async parseUserCompaniesTeams(companies: TeamDTO[]) {
    const companiesTeams = await this.getAllTeamsBelowNodes(companies)

    return companiesTeams
  }
}

export default DomainTeamService
