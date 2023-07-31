import { Injectable } from '@nestjs/common'
import { FindConditions } from 'typeorm'

import { Scope } from '@adapters/policy/enums/scope.enum'
import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { UserInterface } from '@core/modules/user/user.interface'
import { UserProvider } from '@core/modules/user/user.provider'
import { CreationQuery } from '@core/types/creation-query.type'
import { Cacheable } from '@lib/cache/cacheable.decorator'
import { Stopwatch } from '@lib/logger/pino.decorator'

import { TeamScope, TeamScopeFactory } from '../workspace/team-scope.factory'

import { TeamInterface } from './interfaces/team.interface'
import { Team } from './team.orm-entity'
import { TeamRepository } from './team.repository'
import { TeamSpecification } from './team.specification'
import { TeamEntityKey } from './types/team-entity-key.type'
import { TeamEntityRelation } from './types/team-entity-relation.type'

interface GetAscendantsByIdsArguments {
  includeOriginTeams?: boolean
  rootsOnly?: boolean
  filters?: FindConditions<TeamInterface>
  queryOptions?: GetOptions<TeamInterface>
}

@Injectable()
export class TeamProvider extends CoreEntityProvider<Team, TeamInterface> {
  public readonly specification = new TeamSpecification()

  private readonly teamScopeFactory = new TeamScopeFactory()

  constructor(protected readonly repository: TeamRepository, private readonly userProvider: UserProvider) {
    super(TeamProvider.name, repository)
  }

  public async createTeam(data: TeamInterface): Promise<Team> {
    const createdData = await this.create(data)

    return createdData[0]
  }

  @Cacheable((user, filters, options) => [user, filters, options], 15)
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
    userId: string,
    filters?: FindConditions<Team>,
    queryOptions?: GetOptions<Team>,
  ): Promise<Team[]> {
    return this.getAscendantsFromUser(userId, {
      rootsOnly: true,
      filters,
      queryOptions,
    })
  }

  @Stopwatch()
  public async getTeamRelationsByUsers(userIds: string[]): Promise<Record<string, string[]>> {
    const relations = await this.repository.manager.query(`SELECT * FROM team_users_user WHERE user_id = ANY($1)`, [
      userIds,
    ])

    // Build a Record<user_id, team_id[]> map
    return relations.reduce(
      (map, { team_id, user_id }) => ({
        ...map,
        [user_id]: [...map[user_id], team_id],
      }),
      userIds.reduce(
        (initial, userId) => ({
          ...initial,
          [userId]: [],
        }),
        {},
      ),
    )
  }

  @Cacheable((originTeamIds, filters, queryOptions) => [originTeamIds, filters, queryOptions], 15)
  @Stopwatch()
  public async getBidirectionalByIds(
    originTeamIds: string[],
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {
    const orderBy = this.repository.marshalOrderBy(queryOptions?.orderBy)

    const [bidirectionalName, bidirectionalCte, bidirectionalQueryOptions] =
      this.teamScopeFactory.bidirectionalFromTeams(originTeamIds)

    return this.repository
      .createQueryBuilder()
      .where(
        () => `id IN (WITH RECURSIVE ${bidirectionalCte} SELECT id FROM ${bidirectionalName})`,
        bidirectionalQueryOptions,
      )
      .andWhere({ ...filters })
      .take(queryOptions?.limit ?? 0)
      .offset(queryOptions?.offset ?? 0)
      .orderBy(orderBy)
      .getMany()
  }

  @Cacheable(
    (parentTeamIds, includeParentTeams, filters, queryOptions) => [
      parentTeamIds,
      includeParentTeams,
      filters,
      queryOptions,
    ],
    15,
  )
  @Stopwatch()
  public async getDescendantsByIds(
    parentTeamIds: string[],
    includeParentTeams = true,
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {
    const orderBy = this.repository.marshalOrderBy(queryOptions?.orderBy)

    const [descendingTable, descendingCte, descendingQueryOptions] = this.teamScopeFactory.descendingFromTeams({
      parentTeamIds,
      includeParentTeams,
    })

    return this.repository
      .createQueryBuilder()
      .where(() => `id IN (WITH RECURSIVE ${descendingCte} SELECT id FROM ${descendingTable})`, descendingQueryOptions)
      .andWhere({ ...filters })
      .take(queryOptions?.limit ?? 0)
      .offset(queryOptions?.offset ?? 0)
      .orderBy(orderBy)
      .getMany()
  }

  @Stopwatch()
  public async getAscendantsByIds(
    childTeamIds: string[],
    { includeOriginTeams = true, rootsOnly = false, filters, queryOptions }: GetAscendantsByIdsArguments,
  ): Promise<Team[]> {
    const ascendingScope = this.teamScopeFactory.ascendingFromTeams({
      childTeamIds,
      includeOriginTeams,
      rootsOnly,
    })

    return this.getAscendantsFromScope(ascendingScope, filters, queryOptions)
  }

  @Stopwatch()
  public async getAscendantsFromUser(
    userId: string,
    { rootsOnly = false, filters, queryOptions }: Omit<GetAscendantsByIdsArguments, 'includeOriginTeams'>,
  ): Promise<Team[]> {
    const ascendingScope = this.teamScopeFactory.ascendingFromUser({
      userId,
      rootsOnly,
    })

    return this.getAscendantsFromScope(ascendingScope, filters, queryOptions)
  }

  @Cacheable((scope, filters, queryOptions) => [scope, filters, queryOptions], 15)
  @Stopwatch()
  public async getAscendantsFromScope(
    [name, cte, options]: TeamScope,
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {
    const orderBy = this.repository.marshalOrderBy(queryOptions?.orderBy)

    return this.repository
      .createQueryBuilder()
      .where(() => `id IN (WITH RECURSIVE ${cte} SELECT id FROM ${name})`, options)
      .andWhere({ ...filters })
      .take(queryOptions?.limit ?? 0)
      .offset(queryOptions?.offset ?? 0)
      .orderBy(orderBy)
      .getMany()
  }

  @Cacheable((userId, filters, options) => [userId, filters, options], 15)
  @Stopwatch()
  public async getUserCompaniesAndDepartments(
    userId: string,
    filters?: FindConditions<Team>,
    options?: GetOptions<Team>,
  ): Promise<Team[]> {
    const orderBy = this.repository.marshalOrderBy(options?.orderBy)

    const [bidirectionalName, bidirectionalCte, bidirectionalQueryOptions] =
      this.teamScopeFactory.bidirectionalFromUser(userId)

    return this.repository
      .createQueryBuilder()
      .where(
        () => `id IN (WITH RECURSIVE ${bidirectionalCte} SELECT id FROM ${bidirectionalName})`,
        bidirectionalQueryOptions,
      )
      .andWhere({ ...filters })
      .take(options?.limit ?? 0)
      .offset(options?.offset ?? 0)
      .orderBy(orderBy)
      .getMany()
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
  public async buildTeamQueryContext(user: UserInterface, constraint: Scope = Scope.OWNS): Promise<CoreQueryContext> {
    const context = this.buildContext(user, constraint)

    const userTeams = await this.userProvider.getUserTeams(user)

    const tree = await this.getUserCompaniesAndDepartments(user.id)

    const companies = tree.filter((team) => !team.parentId || team.parentId === team.id)
    const teams = tree.filter((team) => team.parentId && team.parentId !== team.id)

    const query = {
      companies,
      teams,
      userTeams,
    }

    return {
      ...context,
      query,
    }
  }

  @Cacheable(
    (teamIDs, filters, queryOptions, selector, relations) => [teamIDs, filters, queryOptions, selector, relations],
    15,
  )
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

  @Cacheable('0', 15)
  public async getFromIndexes(indexes: Partial<TeamInterface>): Promise<Team> {
    return this.repository.findOne(indexes)
  }

  @Stopwatch()
  public async getRootTeamsForTeams(
    teamIds: string[],
    filters?: FindConditions<Team>,
    queryOptions?: GetOptions<Team>,
  ): Promise<Team[]> {
    return this.getAscendantsByIds(teamIds, {
      rootsOnly: true,
      filters,
      queryOptions,
    })
  }

  public async getFromID(id: string): Promise<Team | undefined> {
    return this.getFromIndexes({ id })
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

  public async getTeamsUsersIds(rootTeamId: string): Promise<Array<{ teamId: string; userIds: string[] }>> {
    const [descendingTable, descendingCte, descendingQueryOptions] = this.teamScopeFactory.descendingFromTeams({
      parentTeamIds: [rootTeamId],
      includeParentTeams: true,
    })

    const memberships = await this.repository.manager
      .createQueryBuilder()
      .select(['tu.team_id as team_id', 'json_agg(tu.user_id) as user_ids'])
      .from('team_users_user', 'tu')
      .where(
        () => `tu.team_id IN (WITH RECURSIVE ${descendingCte} SELECT id FROM ${descendingTable})`,
        descendingQueryOptions,
      )
      .groupBy('tu.team_id')
      .getRawMany()

    return memberships.map(([teamId, userIds]) => ({ teamId, userIds }))
  }

  protected async protectCreationQuery(
    _query: CreationQuery<Team>,
    _data: Partial<TeamInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }

  @Stopwatch()
  private async getCompaniesDepartments(companies: Team[], filters?: FindConditions<Team>, options?: GetOptions<Team>) {
    const companyIDs = companies.map((company) => company.id)

    return this.getChildren(companyIDs, filters, options)
  }
}
