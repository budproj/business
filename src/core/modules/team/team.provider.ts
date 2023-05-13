import { Injectable } from '@nestjs/common'
import { filter, flatten, uniqBy } from 'lodash'
import { FindConditions, In } from 'typeorm'

import { Scope } from '@adapters/policy/enums/scope.enum'
import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { UserInterface } from '@core/modules/user/user.interface'
import { UserProvider } from '@core/modules/user/user.provider'
import { CreationQuery } from '@core/types/creation-query.type'
import { Stopwatch } from "@lib/logger/pino.decorator";

import { TeamInterface } from './interfaces/team.interface'
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
    private readonly userProvider: UserProvider,
  ) {
    super(TeamProvider.name, repository)
  }

  public async createTeam(data: TeamInterface): Promise<Team> {
    const createdData = await this.create(data)

    return createdData[0]
  }

  @Stopwatch()
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

  @Stopwatch()
  public async getUserCompanies(
    user: UserInterface,
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ): Promise<Team[]> {
    const teams = await this.userProvider.getUserTeams(user)
    const companyPromises = teams.map(async (team) =>
      this.getRootTeamForTeam(team, filters, options),
    )

    // TODO: rewrite using a single query instead of many queries (low priority, since almost all users belong to a single company)
    const rootCompanies = await Promise.all(companyPromises)
    const unrepeatedRootCompanies = uniqBy(rootCompanies, 'id')
    return unrepeatedRootCompanies
  }

  @Stopwatch()
  public async getDescendantsByIds(
    parentTeamIds: string[],
    includeParentTeams = true,
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {

    const teams = await this.repository.query(
      `WITH RECURSIVE team_tree
        AS (SELECT *
            FROM team
            WHERE id = ANY($1)

            UNION ALL

            SELECT tn.*
            FROM team tn,
                 team_tree tt
            WHERE tn.parent_id = tt.id)
       SELECT DISTINCT id
       FROM team_tree
       WHERE ($2 IS TRUE OR id != ANY($1))
       ORDER BY id`,
      [parentTeamIds, !!includeParentTeams]
    );

    return await this.getMany({
      ...filters,
      id: In(teams.map(({ id }) => id))
    }, undefined, queryOptions);
  }

  @Stopwatch()
  public async getTeamNodesTreeBeforeTeam(
    teams: Partial<TeamInterface> | Array<Partial<TeamInterface>>,
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
  ): Promise<Team[]> {
    const teamsAsArray = Array.isArray(teams) ? teams : [teams]
    const initialNodes: Team[] = await this.getMany({ id: In(teamsAsArray.map(team => team.id)) })

    return this.getNodesFromTeams(initialNodes, 'above', undefined, undefined, selectors, relations)
  }

  @Stopwatch()
  public async getUserCompaniesAndDepartments(
    user: UserInterface,
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ): Promise<Team[]> {
    // TODO: rewrite using a single query
    const companies = await this.getUserCompanies(user, filters, options)
    const departments = await this.getCompaniesDepartments(companies, filters, options)

    return [...companies, ...departments]
  }

  @Stopwatch()
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

  @Stopwatch()
  public async buildTeamQueryContext(
    user: UserInterface,
    constraint: Scope = Scope.OWNS,
  ): Promise<CoreQueryContext> {
    const context = this.buildContext(user, constraint)

    // TODO: rewrite using a single query
    const userCompanies = await this.getUserCompanies(user)
    const userCompanyIDs = userCompanies.map((company) => company.id)
    const userCompaniesTeams = await this.getDescendantsByIds(userCompanyIDs)
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

  @Stopwatch()
  public async getChildren(
    teamIDs: string | string[],
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
    selector?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
  ) {
    const teamIDsList = Array.isArray(teamIDs) ? teamIDs : [teamIDs]
    const getOptions = this.repository.marshalGetOptions(options)
    const whereSelector = teamIDsList.map((parentId) => ({
      ...filters,
      parentId,
    }))

    return this.repository.find({
      ...getOptions,
      relations,
      select: selector,
      where: whereSelector,
    })
  }

  public async getFromIndexes(indexes: Partial<TeamInterface>): Promise<Team> {
    return this.repository.findOne(indexes)
  }

  @Stopwatch()
  public async getRootTeamForTeam(
    team: Partial<TeamInterface>,
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ): Promise<Team> {
    let rootTeam = await this.getOne({ id: team.id })

    // TODO: rewrite this method using a recursive query
    while (rootTeam.parentId && rootTeam.parentId !== rootTeam.id) {
      // Since we're dealing with a linked list, where we need to evaluate each step before trying
      // the next one, we can disable the following eslint rule
      // eslint-disable-next-line no-await-in-loop
      rootTeam = await this.getOne({ ...filters, id: rootTeam.parentId }, undefined, options)
    }

    return rootTeam
  }

  public async getFromID(id: string): Promise<Team | undefined> {
    return this.repository.findOne({ id })
  }

  public async addUserToTeam(userID: string, teamID: string): Promise<void> {
    await this.repository.addUserToTeam(userID, teamID)
  }

  public async removeUserFromTeam(userID: string, teamID: string): Promise<void> {
    await this.repository.removeUserFromTeam(userID, teamID)
  }

  public async getAllCompanies() {
    return this.repository.find({
      where: {
        // eslint-disable-next-line unicorn/no-null
        parentId: null,
      },
    })
  }

  protected async protectCreationQuery(
    _query: CreationQuery<Team>,
    _data: Partial<TeamInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }

  @Stopwatch()
  private async getCompaniesDepartments(
    companies: Team[],
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ) {
    // TODO: rewrite using a single query
    const companyIDs = companies.map((company) => company.id)

    return this.getChildren(companyIDs, filters, options)
  }

  /**
   * @deprecated this method is way too slow and should be replaced with a single query
   */
  @Stopwatch()
  private async getNodesFromTeams(
    nodes: Team[],
    direction: 'above' | 'below',
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
  ) {
    let nextIterationNodes = nodes

    const directionHandlers = {
      below: async (
        team: TeamInterface,
        selectors?: TeamEntityKey[],
        relations?: TeamEntityRelation[],
      ) => this.getChildren(team.id, filters, options, selectors, relations),
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
