import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { flatten, remove, uniqBy } from 'lodash'

import { CONSTRAINT } from 'src/domain/constants'
import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import DomainKeyResultService from 'src/domain/key-result/service'
import DomainTeamRankingService from 'src/domain/team/ranking'
import { UserDTO } from 'src/domain/user/dto'

import { TeamDTO } from './dto'
import { Team } from './entities'
import DomainTeamRepository from './repository'
import DomainTeamSpecification from './specification'
import { TeamEntityFilter, TeamEntityRelation, TeamFilters } from './types'

export interface DomainTeamServiceInterface {
  specification: DomainTeamSpecification

  getFromOwner: (owner: UserDTO) => Promise<Team[]>
  getUserCompanies: (user: UserDTO) => Promise<Team[]>
  getUserCompaniesAndDepartments: (user: UserDTO) => Promise<Team[]>
  getWithUser: (user: UserDTO) => Promise<Team[]>
  getFullTeamNodesTree: (
    nodes: TeamDTO | TeamDTO[],
    filter?: TeamEntityFilter[],
    relations?: TeamEntityRelation[],
  ) => Promise<Array<Partial<Team>>>
  getParentTeam: (team: TeamDTO) => Promise<Team>
  getUsersInTeam: (teamID: TeamDTO) => Promise<UserDTO[]>
  buildTeamQueryContext: (user: UserDTO, constraint?: CONSTRAINT) => Promise<DomainQueryContext>
  getCurrentProgressForTeam: (
    team: TeamDTO,
    filters?: TeamFilters,
  ) => Promise<KeyResultCheckIn['progress']>
  getCurrentConfidenceForTeam: (team: TeamDTO) => Promise<KeyResultCheckIn['confidence']>
  getTeamProgressIncreaseSinceLastWeek: (team: TeamDTO) => Promise<KeyResultCheckIn['progress']>
  getTeamChildTeams: (team: TeamDTO) => Promise<Team[]>
  getTeamRankedChildTeams: (team: TeamDTO) => Promise<Team[]>
  getRankedTeamsBelowNode: (team: TeamDTO) => Promise<Team[]>
}

@Injectable()
class DomainTeamService
  extends DomainEntityService<Team, TeamDTO>
  implements DomainTeamServiceInterface {
  constructor(
    public readonly specification: DomainTeamSpecification,
    protected readonly repository: DomainTeamRepository,
    @Inject(forwardRef(() => DomainKeyResultService))
    private readonly keyResultService: DomainKeyResultService,
    @Inject(forwardRef(() => DomainTeamRankingService))
    private readonly ranking: DomainTeamRankingService,
  ) {
    super(DomainTeamService.name, repository)
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

  public async getFullTeamNodesTree(
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
    const teamsBelowCurrentNode = await this.getFullTeamNodesTree(team)

    const teamUsers = await Promise.all(teamsBelowCurrentNode.map(async (team) => team.users))
    const flattenedTeamUsers = flatten(teamUsers)
    const uniqTeamUsers = uniqBy(flattenedTeamUsers, 'id')

    return uniqTeamUsers
  }

  public async buildTeamQueryContext(user: UserDTO, constraint: CONSTRAINT = CONSTRAINT.OWNS) {
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

  public async getCurrentProgressForTeam(team: TeamDTO, filters?: TeamFilters) {
    const date = new Date()
    const currentCheckInGroup = await this.getCheckInGroupAtDateForTeam(date, team, filters)

    return currentCheckInGroup.progress
  }

  public async getCurrentConfidenceForTeam(team: TeamDTO) {
    const date = new Date()
    const currentCheckInGroup = await this.getCheckInGroupAtDateForTeam(date, team)

    return currentCheckInGroup.confidence
  }

  public async getTeamProgressIncreaseSinceLastWeek(team: TeamDTO) {
    const progress = await this.getCurrentProgressForTeam(team)
    const lastWeekProgress = await this.getLastWeekProgressForTeam(team)

    const deltaProgress = progress - lastWeekProgress

    return deltaProgress
  }

  public async getTeamChildTeams(team: TeamDTO) {
    const childTeams = await this.getMany({ parentTeamId: team.id })

    return childTeams
  }

  public async getTeamRankedChildTeams(team: TeamDTO) {
    const childTeams = await this.getTeamChildTeams(team)
    const rankedChildTeams = await this.ranking.rankTeamsByProgress(childTeams)

    return rankedChildTeams
  }

  public async getRankedTeamsBelowNode(team: TeamDTO) {
    const teamNodeTree = await this.getFullTeamNodesTree(team)
    const teamsBelowTeam = teamNodeTree.slice(1)
    const rankedChildTeams = await this.ranking.rankTeamsByProgress(teamsBelowTeam)

    return rankedChildTeams
  }

  protected async protectCreationQuery(
    _query: DomainCreationQuery<Team>,
    _data: Partial<TeamDTO>,
    _queryContext: DomainQueryContext,
  ) {
    return []
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
    const companiesTeams = await this.getFullTeamNodesTree(companies)

    return companiesTeams
  }

  private async getCheckInGroupAtDateForTeam(date: Date, team: TeamDTO, filters?: TeamFilters) {
    const childTeams = await this.getFullTeamNodesTree(team)
    const keyResults = await this.keyResultService.getFromTeams(childTeams, filters)
    if (!keyResults) return this.keyResultService.buildDefaultCheckInGroup()

    const teamCheckInGroup = this.keyResultService.buildCheckInGroupForKeyResultListAtDate(
      date,
      keyResults,
    )

    return teamCheckInGroup
  }

  private async getLastWeekProgressForTeam(team: TeamDTO) {
    const firstDayAfterLastWeek = this.getFirstDayAfterLastWeek()

    const lastWeekCheckInGroup = await this.getCheckInGroupAtDateForTeam(
      firstDayAfterLastWeek,
      team,
    )

    return lastWeekCheckInGroup.progress
  }
}

export default DomainTeamService
