import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { filter, flatten, uniqBy } from 'lodash'

import { Scope } from '@adapters/authorization/enums/scope.enum'
import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { TeamRankingProvider } from './ranking.provider'
import { TeamInterface } from './team.interface'
import { TeamORMEntity } from './team.orm-entity'
import { TeamRepository } from './team.repository'
import { TeamSpecification } from './team.specification'
import { TeamEntityKey } from './types/team-entity-key.type'
import { TeamEntityRelation } from './types/team-entity-relation.type'

@Injectable()
export class TeamProvider extends CoreEntityProvider<TeamORMEntity, TeamInterface> {
  public readonly specification = new TeamSpecification()

  constructor(
    protected readonly repository: TeamRepository,
    @Inject(forwardRef(() => TeamRankingProvider))
    private readonly ranking: TeamRankingProvider,
  ) {
    super(TeamProvider.name, repository)
  }

  public async getFromOwner(owner: UserInterface): Promise<TeamORMEntity[]> {
    return this.repository.find({ ownerId: owner.id })
  }

  public async getUserCompanies(user: UserInterface): Promise<TeamORMEntity[]> {
    const teams = await this.getWithUser(user)
    const companyPromises = teams.map(async (team) => this.getRootTeamForTeam(team))

    const companies = Promise.all(companyPromises)

    return companies
  }

  public async getWithUser(user: UserInterface): Promise<TeamORMEntity[]> {
    const teams = await user.teams

    return teams as TeamORMEntity[]
  }

  public async getFullTeamNodesTree(
    team: TeamInterface,
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
  ): Promise<TeamORMEntity[]> {
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
  ): Promise<TeamORMEntity[]> {
    const teamsAsArray = Array.isArray(teams) ? teams : [teams]
    const initialNodes: TeamORMEntity[] = await Promise.all(
      teamsAsArray.map(async (team) => this.getOne({ id: team.id })),
    )

    const nodes = await this.getNodesFromTeams(initialNodes, 'below', selectors, relations)

    return nodes
  }

  public async getTeamNodesTreeBeforeTeam(
    teams: TeamInterface | TeamInterface[],
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
  ): Promise<TeamORMEntity[]> {
    const teamsAsArray = Array.isArray(teams) ? teams : [teams]
    const initialNodes: TeamORMEntity[] = await Promise.all(
      teamsAsArray.map(async (team) => this.getOne({ id: team.id })),
    )

    const nodes = await this.getNodesFromTeams(initialNodes, 'above', selectors, relations)

    return nodes
  }

  public async getUserCompaniesAndDepartments(user: UserInterface): Promise<TeamORMEntity[]> {
    const companies = await this.getUserCompanies(user)
    const departments = await this.getUserCompaniesDepartments(user)

    return [...companies, ...departments]
  }

  public async getParentTeam(
    team: TeamInterface,
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
  ): Promise<TeamORMEntity> {
    if (!team.parentId) return
    const whereSelector = { id: team.parentId }

    const parent = await this.repository.findOne({
      relations,
      select: selectors,
      where: whereSelector,
    })

    return parent
  }

  public async getUsersInTeam(team: TeamInterface): Promise<UserInterface[]> {
    const teamsBelowCurrentNode = await this.getTeamNodesTreeAfterTeam(team)

    const teamUsers = await Promise.all(teamsBelowCurrentNode.map(async (team) => team.users))
    const flattenedTeamUsers = flatten(teamUsers)
    const uniqTeamUsers = uniqBy(flattenedTeamUsers, 'id')

    return uniqTeamUsers
  }

  public async buildTeamQueryContext(
    user: UserInterface,
    constraint: Scope = Scope.OWNS,
  ): Promise<CoreQueryContext> {
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

  public async getTeamChildTeams(team: TeamInterface): Promise<TeamORMEntity[]> {
    const childTeams = await this.getMany({ parentId: team.id })

    return childTeams
  }

  public async getTeamRankedChildTeams(team: TeamInterface): Promise<TeamORMEntity[]> {
    const childTeams = await this.getTeamChildTeams(team)
    const rankedChildTeams = await this.ranking.rankTeamsByProgress(childTeams)

    return rankedChildTeams
  }

  public async getRankedTeamsBelowNode(team: TeamInterface): Promise<TeamORMEntity[]> {
    const teamNodeTree = await this.getTeamNodesTreeAfterTeam(team)
    const teamsBelowTeam = teamNodeTree.slice(1)
    const rankedChildTeams = await this.ranking.rankTeamsByProgress(teamsBelowTeam)

    return rankedChildTeams
  }

  protected async protectCreationQuery(
    _query: CreationQuery<TeamORMEntity>,
    _data: Partial<TeamInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }

  private async getRootTeamForTeam(team: TeamInterface) {
    let rootTeam = team

    while (rootTeam.parentId) {
      // Since we're dealing with a linked list, where we need to evaluate each step before trying
      // the next one, we can disable the following eslint rule
      // eslint-disable-next-line no-await-in-loop
      rootTeam = await this.getOne({ id: rootTeam.parentId })
    }

    return rootTeam
  }

  private async getChildTeams(
    teams: TeamInterface | TeamInterface[],
    filter?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
  ) {
    const teamsAsArray = Array.isArray(teams) ? teams : [teams]
    const whereSelector = teamsAsArray.map((team) => ({
      parentId: team.id,
    }))

    const childTeams = await this.repository.find({
      relations,
      select: filter,
      where: whereSelector,
    })

    return childTeams
  }

  private async getUserCompaniesDepartments(user: UserInterface) {
    const companies = await this.getUserCompanies(user)
    const departments = this.getChildTeams(companies)

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
    nodes: TeamORMEntity[],
    direction: 'above' | 'below',
    selectors?: TeamEntityKey[],
    relations?: TeamEntityRelation[],
  ) {
    let nextIterationNodes = nodes

    const directionHandlers = {
      below: async (
        team: TeamInterface,
        selectors?: TeamEntityKey[],
        relations?: TeamEntityRelation[],
      ) => this.getChildTeams(team, selectors, relations),
      above: async (
        team: TeamInterface,
        selectors?: TeamEntityKey[],
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
