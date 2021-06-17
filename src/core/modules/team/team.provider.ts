import { Injectable } from '@nestjs/common'
import { filter, flatten, uniqBy } from 'lodash'
import { Any, FindConditions } from 'typeorm'

import { Scope } from '@adapters/policy/enums/scope.enum'
import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { UserInterface } from '@core/modules/user/user.interface'
import { UserProvider } from '@core/modules/user/user.provider'
import { CreationQuery } from '@core/types/creation-query.type'

import { TeamInterface } from './interfaces/team.interface'
import { TeamRankingProvider } from './ranking.provider'
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

    return Promise.all(companyPromises)
  }

  public async getTeamNodesTreeAfterTeam(
    teams: Partial<TeamInterface> | Array<Partial<TeamInterface>>,
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {
    const teamsAsArray = Array.isArray(teams) ? teams : [teams]
    const initialNodes: Team[] = await Promise.all(
      teamsAsArray.map(async (team) => this.getOne({ id: team.id })),
    )

    return this.getNodesFromTeams(
      initialNodes,
      'below',
      selectors,
      relations,
      filters,
      queryOptions,
    )
  }

  public async getTeamNodesTreeBeforeTeam(
    teams: Partial<TeamInterface> | Array<Partial<TeamInterface>>,
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
  ): Promise<Team[]> {
    const teamsAsArray = Array.isArray(teams) ? teams : [teams]
    const initialNodes: Team[] = await Promise.all(
      teamsAsArray.map(async (team) => this.getOne({ id: team.id })),
    )

    return this.getNodesFromTeams(initialNodes, 'above', selectors, relations)
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

    return this.repository.findOne({
      ...options,
      relations,
      select: selectors,
      where: whereSelector,
    })
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

    return this.userProvider.getMany(selector, undefined, queryOptions)
  }

  public async buildTeamQueryContext(
    user: UserInterface,
    constraint: Scope = Scope.OWNS,
  ): Promise<CoreQueryContext> {
    const context = this.buildContext(user, constraint)

    const userCompanies = await this.getUserCompanies(user)
    const userCompaniesTeams = await this.getUserCompaniesTeams(userCompanies)
    const userTeams = await this.userProvider.getUserTeams(user)

    const query = {
      companies: userCompanies,
      teams: userCompaniesTeams,
      userTeams,
    }

    return {
      ...context,
      query,
    }
  }

  public async getTeamChildTeams(
    team: TeamInterface,
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {
    return this.getChildTeams(team, undefined, undefined, filters, queryOptions)
  }

  public async getTeamRankedChildTeams(team: TeamInterface): Promise<Team[]> {
    const childTeams = await this.getTeamChildTeams(team)

    return this.ranking.rankTeamsByProgress(childTeams)
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

    return this.ranking.rankTeamsByProgress(teamsBelowTeam)
  }

  public async getFromIndexes(indexes: Partial<TeamInterface>): Promise<Team> {
    return this.repository.findOne(indexes)
  }

  public async getRootTeamForTeam(
    team: Partial<TeamInterface>,
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

  protected async protectCreationQuery(
    _query: CreationQuery<Team>,
    _data: Partial<TeamInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
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

    return this.repository.find({
      ...getOptions,
      relations,
      select: selector,
      where: whereSelector,
    })
  }

  private async getUserCompaniesDepartments(
    user: UserInterface,
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ) {
    const companies = await this.getUserCompanies(user)

    return this.getChildTeams(companies, undefined, undefined, filters, options)
  }

  private async getUserCompaniesTeams(companies: TeamInterface[]) {
    return this.getTeamNodesTreeAfterTeam(companies)
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

    return uniqBy(clearedNodes, 'id')
  }
}
