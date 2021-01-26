import { Injectable } from '@nestjs/common'
import { flatten, remove } from 'lodash'

import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { TeamEntityFilter, TeamEntityRelation } from 'src/domain/team/types'
import { UserDTO } from 'src/domain/user/dto'

import { TeamDTO } from './dto'
import { Team } from './entities'
import DomainTeamRepository from './repository'
import DomainTeamSpecification from './specification'

export interface DomainTeamServiceInterface {
  getFromOwner: (userID: UserDTO['id']) => Promise<Team[]>
  getUserCompanies: (user: UserDTO) => Promise<TeamDTO[]>
  getUserCompaniesAndDepartments: (user: UserDTO) => Promise<TeamDTO[]>
  getForUser: (user: UserDTO) => Promise<TeamDTO[]>
  getAllTeamsBelowNodes: (
    nodes: TeamDTO['id'] | Array<TeamDTO['id']>,
    filter?: TeamEntityFilter[],
    relations?: TeamEntityRelation[],
  ) => Promise<Array<Partial<Team>>>
  getParentTeam: (teamID: TeamDTO['id']) => Promise<Team>
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

  public async getFromOwner(ownerId: UserDTO['id']) {
    return this.repository.find({ ownerId })
  }

  public async getUserCompanies(user: UserDTO) {
    const teams = await this.getForUser(user)
    const companyPromises = teams.map(async (team) => this.getRootTeamForTeam(team))

    const companies = Promise.all(companyPromises)

    return companies
  }

  public async getForUser(user: UserDTO) {
    const teams = await user.teams

    return teams
  }

  public async getAllTeamsBelowNodes(
    nodes: TeamDTO['id'] | Array<TeamDTO['id']>,
    filter?: TeamEntityFilter[],
    relations?: TeamEntityRelation[],
  ) {
    const nodesAsArray = Array.isArray(nodes) ? nodes : [nodes]

    let teams: Array<Partial<Team>> = await Promise.all(
      nodesAsArray.map(async (id) => this.getOne({ id })),
    )
    let nextIterationTeams = nodesAsArray

    while (nextIterationTeams.length > 0) {
      // Since we're dealing with a linked list, where we need to evaluate each step before
      // trying the next one, we can disable the following eslint rule
      // eslint-disable-next-line no-await-in-loop
      const selectedTeams = await Promise.all(
        nextIterationTeams.map(async (teamID) => this.getChildTeams(teamID, filter, relations)),
      )
      const currentIterationTeams = flatten(selectedTeams)

      teams = [...teams, ...currentIterationTeams]
      nextIterationTeams = remove(currentIterationTeams.map((team) => team?.id))
    }

    return teams
  }

  public async getUserCompaniesAndDepartments(user: UserDTO) {
    const companies = await this.getUserCompanies(user)
    const departments = await this.getUserCompaniesDepartments(user)

    return [...companies, ...departments]
  }

  public async getParentTeam(teamID: TeamDTO['id']) {
    const { parentTeamId } = await this.getOne({ id: teamID })

    return this.getOne({ id: parentTeamId })
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
    let rootTeam = team

    while (rootTeam.parentTeamId) {
      // Since we're dealing with a linked list, where we need to evaluate each step before trying
      // the next one, we can disable the following eslint rule
      // eslint-disable-next-line no-await-in-loop
      rootTeam = await this.getOne({ id: rootTeam.parentTeamId })
    }

    return rootTeam
  }

  private async getChildTeams(
    teamID: TeamDTO['id'] | Array<TeamDTO['id']>,
    filter?: TeamEntityFilter[],
    relations?: TeamEntityRelation[],
  ) {
    const teamIDs = Array.isArray(teamID) ? teamID : [teamID]
    const whereSelector = teamIDs.map((teamID) => ({
      parentTeamId: teamID,
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
    const companyIDs = companies.map((company) => company.id)

    const departments = this.getChildTeams(companyIDs)

    return departments
  }
}

export default DomainTeamService
