import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { filter, flatten, maxBy, meanBy, minBy, uniqBy } from 'lodash'
import { Any, FindConditions } from 'typeorm'

import { Scope } from '@adapters/authorization/enums/scope.enum'
import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { ObjectiveProvider } from '@core/modules/objective/objective.provider'
import { UserInterface } from '@core/modules/user/user.interface'
import { UserProvider } from '@core/modules/user/user.provider'
import { CreationQuery } from '@core/types/creation-query.type'

import { TeamStatus } from './interfaces/team-status.interface'
import { TeamInterface } from './interfaces/team.interface'
import { TeamRankingProvider } from './ranking.provider'
import { DEFAULT_CONFIDENCE, DEFAULT_PROGRESS } from './team.constants'
import { Team } from './team.orm-entity'
import { TeamRepository } from './team.repository'
import { TeamSpecification } from './team.specification'
import { TeamEntityKey } from './types/team-entity-key.type'
import { TeamEntityRelation } from './types/team-entity-relation.type'

@Injectable()
export class TeamProvider extends CoreEntityProvider<Team, TeamInterface> {
  public readonly specification = new TeamSpecification()

  constructor(
    protected readonly repository: TeamRepository,
    private readonly ranking: TeamRankingProvider,
    private readonly userProvider: UserProvider,
    @Inject(forwardRef(() => ObjectiveProvider))
    private readonly objectiveProvider: ObjectiveProvider,
  ) {
    super(TeamProvider.name, repository)
  }

  public async getFromOwner(
    user: UserInterface,
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ): Promise<Team[]> {
    const queryOptions = this.repository.marshalGetOptions(options)
    const whereSelector = {
      ...filters,
      ownerId: user.id,
    }

    return this.repository.find({
      ...queryOptions,
      where: whereSelector,
    })
  }

  public async getUserCompanies(
    user: UserInterface,
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ): Promise<Team[]> {
    const teams = await this.userProvider.getUserTeams(user)
    const companyPromises = teams.map(async (team) =>
      this.getRootTeamForTeam(team, filters, options),
    )

    const companies = Promise.all(companyPromises)

    return companies
  }

  public async getFullTeamNodesTree(
    team: TeamInterface,
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
  ): Promise<Team[]> {
    const childTeams = await this.getTeamNodesTreeAfterTeam(team, selectors, relations)
    const parents = await this.getTeamNodesTreeBeforeTeam(team, selectors, relations)

    const rawNodes = [...parents, ...childTeams]
    const nodes = uniqBy(rawNodes, 'id')
    const clearedNodes = filter(nodes)

    return clearedNodes
  }

  public async getTeamNodesTreeAfterTeam(
    teams: TeamInterface | TeamInterface[],
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {
    const teamsAsArray = Array.isArray(teams) ? teams : [teams]
    const initialNodes: Team[] = await Promise.all(
      teamsAsArray.map(async (team) => this.getOne({ id: team.id })),
    )

    const nodes = await this.getNodesFromTeams(
      initialNodes,
      'below',
      selectors,
      relations,
      filters,
      queryOptions,
    )

    return nodes
  }

  public async getTeamNodesTreeBeforeTeam(
    teams: TeamInterface | TeamInterface[],
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
  ): Promise<Team[]> {
    const teamsAsArray = Array.isArray(teams) ? teams : [teams]
    const initialNodes: Team[] = await Promise.all(
      teamsAsArray.map(async (team) => this.getOne({ id: team.id })),
    )

    const nodes = await this.getNodesFromTeams(initialNodes, 'above', selectors, relations)

    return nodes
  }

  public async getUserCompaniesAndDepartments(
    user: UserInterface,
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ): Promise<Team[]> {
    const companies = await this.getUserCompanies(user, filters, options)
    const departments = await this.getUserCompaniesDepartments(user, filters, options)

    return [...companies, ...departments]
  }

  public async getParentTeam(
    team: TeamInterface,
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ): Promise<Team> {
    if (!team.parentId) return
    const whereSelector = { ...filters, id: team.parentId }

    const parent = await this.repository.findOne({
      ...options,
      relations,
      select: selectors,
      where: whereSelector,
    })

    return parent
  }

  public async getUsersInTeam(
    team: TeamInterface,
    userFilters?: FindConditions<UserInterface>,
    queryOptions?: GetOptions<UserInterface>,
  ): Promise<UserInterface[]> {
    const teamsBelowCurrentNode = await this.getTeamNodesTreeAfterTeam(team)

    const teamsUsers = await Promise.all(teamsBelowCurrentNode.map(async (team) => team.users))
    const userIDs = flatten(teamsUsers).map((user) => user.id)

    const selector = {
      ...userFilters,
      id: Any(userIDs),
    }

    const users = await this.userProvider.getMany(selector, undefined, queryOptions)

    return users
  }

  public async buildTeamQueryContext(
    user: UserInterface,
    constraint: Scope = Scope.OWNS,
  ): Promise<CoreQueryContext> {
    const context = this.buildContext(user, constraint)

    const userCompanies = await this.parseUserCompanies(user)
    const userCompaniesTeams = await this.parseUserCompaniesTeams(userCompanies)
    const userTeams = await this.userProvider.getUserTeams(user)

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

  public async getTeamChildTeams(
    team: TeamInterface,
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {
    const childTeams = await this.getChildTeams(team, undefined, undefined, filters, queryOptions)

    return childTeams
  }

  public async getTeamRankedChildTeams(team: TeamInterface): Promise<Team[]> {
    const childTeams = await this.getTeamChildTeams(team)
    const rankedChildTeams = await this.ranking.rankTeamsByProgress(childTeams)

    return rankedChildTeams
  }

  public async getRankedTeamsBelowNode(
    team: TeamInterface,
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {
    const teamNodeTree = await this.getTeamNodesTreeAfterTeam(
      team,
      undefined,
      undefined,
      filters,
      queryOptions,
    )
    const teamsBelowTeam = teamNodeTree.slice(1)
    const rankedChildTeams = await this.ranking.rankTeamsByProgress(teamsBelowTeam)

    return rankedChildTeams
  }

  public async getCurrentStatus(team: TeamInterface): Promise<TeamStatus> {
    const date = new Date()
    const teamStatus = await this.getStatusAtDate(date, team)

    return teamStatus
  }

  public async getTeamProgressIncreaseSinceLastWeek(team: TeamInterface): Promise<number> {
    const progress = await this.getCurrentProgressForTeam(team)
    const lastWeekProgress = await this.getLastWeekProgressForTeam(team)

    const deltaProgress = progress - lastWeekProgress

    return deltaProgress
  }

  protected async protectCreationQuery(
    _query: CreationQuery<Team>,
    _data: Partial<TeamInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }

  private async getRootTeamForTeam(
    team: TeamInterface,
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ): Promise<Team> {
    let rootTeam = await this.getOne({ id: team.id })

    while (rootTeam.parentId) {
      // Since we're dealing with a linked list, where we need to evaluate each step before trying
      // the next one, we can disable the following eslint rule
      // eslint-disable-next-line no-await-in-loop
      rootTeam = await this.getOne({ ...filters, id: rootTeam.parentId }, undefined, options)
    }

    return rootTeam
  }

  private async getChildTeams(
    teams: TeamInterface | TeamInterface[],
    selector?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ) {
    const teamsAsArray = Array.isArray(teams) ? teams : [teams]
    const getOptions = this.repository.marshalGetOptions(options)
    const whereSelector = teamsAsArray.map((team) => ({
      ...filters,
      parentId: team.id,
    }))

    const childTeams = await this.repository.find({
      ...getOptions,
      relations,
      select: selector,
      where: whereSelector,
    })

    return childTeams
  }

  private async getUserCompaniesDepartments(
    user: UserInterface,
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ) {
    const companies = await this.getUserCompanies(user)
    const departments = this.getChildTeams(companies, undefined, undefined, filters, options)

    return departments
  }

  private async parseUserCompanies(user: UserInterface) {
    const userCompanies = await this.getUserCompanies(user)

    return userCompanies
  }

  private async parseUserCompaniesTeams(companies: TeamInterface[]) {
    const companiesTeams = await this.getTeamNodesTreeAfterTeam(companies)

    return companiesTeams
  }

  private async getNodesFromTeams(
    nodes: Team[],
    direction: 'above' | 'below',
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ) {
    let nextIterationNodes = nodes

    const directionHandlers = {
      below: async (
        team: TeamInterface,
        selectors?: TeamEntityKey[],
        relations?: TeamEntityRelation[],
      ) => this.getChildTeams(team, selectors, relations, filters, options),
      above: async (
        team: TeamInterface,
        selectors?: TeamEntityKey[],
        relations?: TeamEntityRelation[],
      ) => this.getParentTeam(team, selectors, relations, filters, options),
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

  private async getStatusAtDate(date: Date, team: TeamInterface): Promise<TeamStatus> {
    const childTeams = await this.getTeamNodesTreeAfterTeam(team)
    const objectives = await this.objectiveProvider.getFromTeams(childTeams)
    if (!objectives || objectives.length === 0) return this.buildDefaultStatus(date)

    const teamStatus = await this.buildStatusAtDate(date, objectives)

    return teamStatus
  }

  private async buildStatusAtDate(
    date: Date,
    objectives: Objective[],
  ): Promise<TeamStatus | undefined> {
    const objectiveStatusPromises = objectives.map(async (objective) =>
      this.objectiveProvider.getStatusAtDate(date, objective),
    )
    const objectiveStatus = await Promise.all(objectiveStatusPromises)
    const latestObjectiveStatus = maxBy(objectiveStatus, 'createdAt')
    if (!latestObjectiveStatus) return

    const teamStatus = {
      latestObjectiveStatus,
      progress: meanBy(objectiveStatus, 'progress'),
      confidence: minBy(objectiveStatus, 'confidence').confidence,
      createdAt: latestObjectiveStatus.createdAt,
    }

    return teamStatus
  }

  private buildDefaultStatus(
    date?: Date,
    progress: number = DEFAULT_PROGRESS,
    confidence: number = DEFAULT_CONFIDENCE,
  ) {
    date ??= new Date()

    const defaultStatus = {
      progress,
      confidence,
      createdAt: date,
    }

    return defaultStatus
  }

  private async getCurrentProgressForTeam(team: TeamInterface): Promise<number> {
    const date = new Date()
    const currentStatus = await this.getStatusAtDate(date, team)

    return currentStatus?.progress ?? DEFAULT_PROGRESS
  }

  private async getLastWeekProgressForTeam(team: TeamInterface): Promise<number> {
    const firstDayAfterLastWeek = this.getFirstDayAfterLastWeek()

    const lastWeekStatus = await this.getStatusAtDate(firstDayAfterLastWeek, team)

    return lastWeekStatus?.progress ?? DEFAULT_PROGRESS
  }
}
