import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { filter, flatten, maxBy, meanBy, minBy, uniqBy } from 'lodash'

import { CONSTRAINT } from 'src/domain/constants'
import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import { DomainKeyResultStatus } from 'src/domain/key-result/service'
import { Objective } from 'src/domain/objective/entities'
import DomainObjectiveService, { DomainObjectiveStatus } from 'src/domain/objective/service'
import DomainTeamRankingService from 'src/domain/team/ranking'
import { UserDTO } from 'src/domain/user/dto'

import { DEFAULT_PROGRESS, DEFAULT_CONFIDENCE } from './constants'
import { TeamDTO } from './dto'
import { Team } from './entities'
import DomainTeamRepository from './repository'
import DomainTeamSpecification from './specification'
import { TeamEntitySelector, TeamEntityRelation } from './types'

export interface DomainTeamServiceInterface {
  specification: DomainTeamSpecification

  getFromOwner: (owner: UserDTO) => Promise<Team[]>
  getUserCompanies: (user: UserDTO) => Promise<Team[]>
  getUserCompaniesAndDepartments: (user: UserDTO) => Promise<Team[]>
  getWithUser: (user: UserDTO) => Promise<Team[]>
  getFullTeamNodesTree: (
    team: TeamDTO,
    selectors?: TeamEntitySelector[],
    relations?: TeamEntityRelation[],
  ) => Promise<Array<Partial<Team>>>
  getTeamNodesTreeAfterTeam: (
    nodes: TeamDTO | TeamDTO[],
    selectors?: TeamEntitySelector[],
    relations?: TeamEntityRelation[],
  ) => Promise<Array<Partial<Team>>>
  getTeamNodesTreeBeforeTeam: (
    team: TeamDTO,
    selectors?: TeamEntitySelector[],
    relations?: TeamEntityRelation[],
  ) => Promise<Array<Partial<Team>>>
  getParentTeam: (
    team: TeamDTO,
    selectors?: TeamEntitySelector[],
    relations?: TeamEntityRelation[],
  ) => Promise<Team>
  getUsersInTeam: (teamID: TeamDTO) => Promise<UserDTO[]>
  buildTeamQueryContext: (user: UserDTO, constraint?: CONSTRAINT) => Promise<DomainQueryContext>
  getCurrentProgressForTeam: (team: TeamDTO) => Promise<KeyResultCheckIn['progress']>
  getCurrentConfidenceForTeam: (team: TeamDTO) => Promise<KeyResultCheckIn['confidence']>
  getTeamProgressIncreaseSinceLastWeek: (team: TeamDTO) => Promise<KeyResultCheckIn['progress']>
  getTeamChildTeams: (team: TeamDTO) => Promise<Team[]>
  getTeamRankedChildTeams: (team: TeamDTO) => Promise<Team[]>
  getRankedTeamsBelowNode: (team: TeamDTO) => Promise<Team[]>
  getCurrentStatus: (team: TeamDTO) => Promise<DomainTeamStatus>
}

export interface DomainTeamStatus extends DomainKeyResultStatus {
  latestObjectiveStatus?: DomainObjectiveStatus
}

@Injectable()
class DomainTeamService
  extends DomainEntityService<Team, TeamDTO>
  implements DomainTeamServiceInterface {
  constructor(
    public readonly specification: DomainTeamSpecification,
    protected readonly repository: DomainTeamRepository,
    @Inject(forwardRef(() => DomainObjectiveService))
    private readonly objectiveService: DomainObjectiveService,
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
    team: TeamDTO,
    selectors?: TeamEntitySelector[],
    relations?: TeamEntityRelation[],
  ) {
    const childTeams = await this.getTeamNodesTreeAfterTeam(team, selectors, relations)
    const parentTeams = await this.getTeamNodesTreeBeforeTeam(team, selectors, relations)

    const rawNodes = [...parentTeams, ...childTeams]
    const nodes = uniqBy(rawNodes, 'id')
    const clearedNodes = filter(nodes)

    return clearedNodes
  }

  public async getTeamNodesTreeAfterTeam(
    teams: TeamDTO | TeamDTO[],
    selectors?: TeamEntitySelector[],
    relations?: TeamEntityRelation[],
  ) {
    const teamsAsArray = Array.isArray(teams) ? teams : [teams]
    const initialNodes: Team[] = await Promise.all(
      teamsAsArray.map(async (team) => this.getOne({ id: team.id })),
    )

    const nodes = await this.getNodesFromTeams(initialNodes, 'below', selectors, relations)

    return nodes
  }

  public async getTeamNodesTreeBeforeTeam(
    teams: TeamDTO | TeamDTO[],
    selectors?: TeamEntitySelector[],
    relations?: TeamEntityRelation[],
  ) {
    const teamsAsArray = Array.isArray(teams) ? teams : [teams]
    const initialNodes: Team[] = await Promise.all(
      teamsAsArray.map(async (team) => this.getOne({ id: team.id })),
    )

    const nodes = await this.getNodesFromTeams(initialNodes, 'above', selectors, relations)

    return nodes
  }

  public async getUserCompaniesAndDepartments(user: UserDTO) {
    const companies = await this.getUserCompanies(user)
    const departments = await this.getUserCompaniesDepartments(user)

    return [...companies, ...departments]
  }

  public async getParentTeam(
    team: TeamDTO,
    selectors?: TeamEntitySelector[],
    relations?: TeamEntityRelation[],
  ) {
    if (!team.parentTeamId) return
    const whereSelector = { id: team.parentTeamId }

    const parentTeam = await this.repository.findOne({
      relations,
      select: selectors,
      where: whereSelector,
    })

    return parentTeam
  }

  public async getUsersInTeam(team: TeamDTO) {
    const teamsBelowCurrentNode = await this.getTeamNodesTreeAfterTeam(team)

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

  public async getCurrentProgressForTeam(team: TeamDTO) {
    const date = new Date()
    const currentStatus = await this.getStatusAtDate(date, team)

    return currentStatus?.progress ?? DEFAULT_PROGRESS
  }

  public async getCurrentConfidenceForTeam(team: TeamDTO) {
    const date = new Date()
    const currentStatus = await this.getStatusAtDate(date, team)

    return currentStatus?.confidence ?? DEFAULT_CONFIDENCE
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
    const teamNodeTree = await this.getTeamNodesTreeAfterTeam(team)
    const teamsBelowTeam = teamNodeTree.slice(1)
    const rankedChildTeams = await this.ranking.rankTeamsByProgress(teamsBelowTeam)

    return rankedChildTeams
  }

  public async getCurrentStatus(team: TeamDTO) {
    const date = new Date()
    const teamStatus = await this.getStatusAtDate(date, team)

    return teamStatus
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
    filter?: TeamEntitySelector[],
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
    const companiesTeams = await this.getTeamNodesTreeAfterTeam(companies)

    return companiesTeams
  }

  private async getStatusAtDate(date: Date, team: TeamDTO) {
    const childTeams = await this.getTeamNodesTreeAfterTeam(team)
    const objectives = await this.objectiveService.getFromTeams(childTeams)
    if (!objectives || objectives.length === 0) return this.buildDefaultStatus(date)

    const teamStatus = await this.buildStatusAtDate(date, objectives)

    return teamStatus
  }

  private async buildStatusAtDate(
    date: Date,
    objectives: Objective[],
  ): Promise<DomainTeamStatus | undefined> {
    const objectiveStatusPromises = objectives.map(async (objective) =>
      this.objectiveService.getStatusAtDate(date, objective),
    )
    const objectiveStatuss = await Promise.all(objectiveStatusPromises)
    const latestObjectiveStatus = maxBy(objectiveStatuss, 'createdAt')
    if (!latestObjectiveStatus) return

    const teamStatus: DomainTeamStatus = {
      latestObjectiveStatus,
      progress: meanBy(objectiveStatuss, 'progress'),
      confidence: minBy(objectiveStatuss, 'confidence').confidence,
      createdAt: latestObjectiveStatus.createdAt,
    }

    return teamStatus
  }

  private buildDefaultStatus(
    date?: DomainTeamStatus['createdAt'],
    progress: DomainTeamStatus['progress'] = DEFAULT_PROGRESS,
    confidence: DomainTeamStatus['confidence'] = DEFAULT_CONFIDENCE,
  ) {
    date ??= new Date()

    const defaultStatus: DomainTeamStatus = {
      progress,
      confidence,
      createdAt: date,
    }

    return defaultStatus
  }

  private async getLastWeekProgressForTeam(team: TeamDTO) {
    const firstDayAfterLastWeek = this.getFirstDayAfterLastWeek()

    const lastWeekStatus = await this.getStatusAtDate(firstDayAfterLastWeek, team)

    return lastWeekStatus?.progress ?? DEFAULT_PROGRESS
  }

  private async getNodesFromTeams(
    nodes: Team[],
    direction: 'above' | 'below',
    selectors?: TeamEntitySelector[],
    relations?: TeamEntityRelation[],
  ) {
    let nextIterationNodes = nodes

    const directionHandlers = {
      below: async (
        team: TeamDTO,
        selectors?: TeamEntitySelector[],
        relations?: TeamEntityRelation[],
      ) => this.getChildTeams(team, selectors, relations),
      above: async (
        team: TeamDTO,
        selectors?: TeamEntitySelector[],
        relations?: TeamEntityRelation[],
      ) => this.getParentTeam(team, selectors, relations),
    }
    const directionHandler = directionHandlers[direction]

    while (nextIterationNodes.length > 0) {
      // Since we're dealing with a linked list, where we need to evaluate each step before
      // trying the next one, we can disable the following eslint rule
      // eslint-disable-next-line no-await-in-loop
      const selectedNodes = await Promise.all(
        nextIterationNodes.map(async (node) => directionHandler(node, selectors, relations)),
      )
      const currentIterationNodes = flatten(selectedNodes)

      nodes = [...nodes, ...currentIterationNodes]
      nextIterationNodes = filter(currentIterationNodes)
    }

    const clearedNodes = filter(nodes)
    const uniqNodes = uniqBy(clearedNodes, 'id')

    return uniqNodes
  }
}

export default DomainTeamService
