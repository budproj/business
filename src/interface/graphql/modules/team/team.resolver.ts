import { InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'
import { uniqBy } from 'lodash'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Delta } from '@core/interfaces/delta.interface'
import { Status } from '@core/interfaces/status.interface'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { CycleGraphQLNode } from '@interface/graphql/modules/cycle/cycle.node'
import { CycleFiltersRequest } from '@interface/graphql/modules/cycle/requests/cycle-filters.request'
import { KeyResultFiltersRequest } from '@interface/graphql/modules/key-result/requests/key-result-filters.request'
import { ObjectiveFiltersRequest } from '@interface/graphql/modules/objective/requests/objective-filters.request'
import { TeamStatusRequest } from '@interface/graphql/modules/team/requests/team-status.request'
import { UserFiltersRequest } from '@interface/graphql/modules/user/requests/user-filters.request'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { DeltaGraphQLObject } from '@interface/graphql/objects/delta.object'
import { StatusGraphQLObject } from '@interface/graphql/objects/status.object'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { TeamCyclesGraphQLConnection } from './connections/team-cycles/team-cycles.connection'
import { TeamKeyResultsGraphQLConnection } from './connections/team-key-results/team-key-results.connection'
import { TeamObjectivesGraphQLConnection } from './connections/team-objectives/team-objectives.connection'
import { TeamTeamsGraphQLConnection } from './connections/team-teams/team-teams.connection'
import { TeamUsersGraphQLConnection } from './connections/team-users/team-users.connection'
import { TeamCreateRequest } from './requests/team-create.request'
import { TeamFiltersRequest } from './requests/team-filters.request'
import { TeamMembersFiltersRequest } from './requests/team-members-filters.request'
import { TeamAccessControl } from './team.access-control'
import { TeamGraphQLNode } from './team.node'

@GuardedResolver(TeamGraphQLNode)
export class TeamGraphQLResolver extends GuardedNodeGraphQLResolver<Team, TeamInterface> {
  private readonly logger = new Logger(TeamGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    protected readonly corePorts: CorePortsProvider,
    protected readonly accessControl: TeamAccessControl,
  ) {
    super(Resource.TEAM, core, core.team, accessControl)
  }

  @GuardedQuery(TeamGraphQLNode, 'team:read', { name: 'team' })
  protected async getTeamForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      message: 'Fetching team with provided indexes',
    })

    const team = await this.queryGuard.getOneWithActionScopeConstraint(request, userWithContext)
    if (!team) throw new UserInputError(`We could not found a team with the provided arguments`)

    return team
  }

  @GuardedMutation(TeamGraphQLNode, 'team:create', { name: 'createTeam' })
  protected async createTeamForRequestAndRequestUserWithContext(
    @Args() request: TeamCreateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const { parentID, ...data } = request.data

    const canCreate = await this.accessControl.canCreate(userWithContext, parentID)
    if (!canCreate) throw new UnauthorizedException()

    this.logger.log({
      userWithContext,
      request,
      message: 'Received create team request',
    })

    const payload = {
      name: data.name,
      description: data.description,
      gender: data.gender,
      ownerId: data.ownerID,
      parentId: parentID,
    }

    const createdTeam = await this.corePorts.dispatchCommand<Team>('create-team', payload)
    if (!createdTeam) throw new InternalServerErrorException('We were not able to create your user')

    return createdTeam
  }

  @ResolveField('status', () => StatusGraphQLObject)
  protected async getStatusForCycle(
    @Parent() team: TeamGraphQLNode,
    @Args() request: TeamStatusRequest,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching current status for this team',
    })

    const result = await this.corePorts.dispatchCommand<Status>('get-team-status', team.id, request)
    if (!result)
      throw new UserInputError(`We could not find status for the team with ID ${team.id}`)

    return result
  }

  @ResolveField('owner', () => UserGraphQLNode)
  protected async getOwnerForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching owner for team',
    })

    return this.core.user.getOne({ id: team.ownerId })
  }

  @ResolveField('teams', () => TeamTeamsGraphQLConnection, { nullable: true })
  protected async getChildTeamsForTeam(
    @Args() request: TeamFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching child teams for team',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      TeamFiltersRequest,
      Team
    >(request)

    const queryResult = await this.core.team.getChildren(team.id, filters, queryOptions)

    return this.relay.marshalResponse<TeamInterface>(queryResult, connection, team)
  }

  @ResolveField('rankedDescendants', () => TeamTeamsGraphQLConnection, { nullable: true })
  protected async getRankedDescendantsForTeam(
    @Args() request: TeamFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching ranked descendants for team',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      TeamFiltersRequest,
      Team
    >(request)

    const result = await this.corePorts.dispatchCommand<Team[]>(
      'get-team-ranked-descendants',
      team.id,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<TeamInterface>(result, connection, team)
  }

  @ResolveField('parent', () => TeamGraphQLNode, { nullable: true })
  protected async getParentForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching parent team for team',
    })

    return this.core.team.getOne({ id: team.parentId })
  }

  @ResolveField('users', () => TeamUsersGraphQLConnection, { nullable: true })
  protected async getUsersForTeam(
    @Args() request: TeamMembersFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching users for team',
    })

    const [filters, getOptions, connection] = this.relay.unmarshalRequest<UserFiltersRequest, User>(
      request,
    )

    const queryResult = await this.corePorts.dispatchCommand<User[]>(
      'get-team-members',
      team.id,
      filters,
      getOptions,
    )

    return this.relay.marshalResponse<UserInterface>(queryResult, connection, team)
  }

  @ResolveField('isCompany', () => Boolean)
  protected async getIsCompanyForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Deciding if the team is a company',
    })

    return this.core.team.specification.isACompany.isSatisfiedBy(team)
  }

  @ResolveField('cycles', () => TeamCyclesGraphQLConnection, { nullable: true })
  protected async getCyclesForTeam(
    @Args() request: CycleFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching cycles for team',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      CycleFiltersRequest,
      Cycle
    >(request)

    const queryResult = await this.core.cycle.getFromTeamsWithFilters([team], filters, queryOptions)

    return this.relay.marshalResponse<CycleInterface>(queryResult, connection, team)
  }

  @ResolveField('objectives', () => TeamObjectivesGraphQLConnection, { nullable: true })
  protected async getObjectivesForRequestAndUser(
    @Args() request: ObjectiveFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching objectives for team',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      ObjectiveFiltersRequest,
      Objective
    >(request)

    const objectiveOrderAttributes = this.marshalOrderAttributes(queryOptions, ['createdAt'])
    const orderAttributes = [['objective', objectiveOrderAttributes]]

    const objectives = await this.corePorts.dispatchCommand<Objective[]>(
      'get-team-objectives',
      team.id,
      filters,
      orderAttributes,
    )

    return this.relay.marshalResponse<ObjectiveInterface>(objectives, connection, team)
  }

  @ResolveField('supportObjectives', () => TeamObjectivesGraphQLConnection, { nullable: true })
  protected async getSupportObjectivesForRequestAndUser(
    @Args() request: ObjectiveFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching support objectives for team',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      ObjectiveFiltersRequest,
      Objective
    >(request)

    const objectiveOrderAttributes = this.marshalOrderAttributes(queryOptions, ['createdAt'])
    const orderAttributes = [['objective', objectiveOrderAttributes]]

    const objectives = await this.corePorts.dispatchCommand<Objective[]>(
      'get-team-support-objectives',
      team.id,
      filters,
      orderAttributes,
    )

    return this.relay.marshalResponse<ObjectiveInterface>(objectives, connection, team)
  }

  @ResolveField('allObjectives', () => TeamObjectivesGraphQLConnection, { nullable: true })
  protected async getAllObjectivesForRequestAndUser(
    @Args() request: ObjectiveFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching all objectives for team',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      ObjectiveFiltersRequest,
      Objective
    >(request)

    const objectiveOrderAttributes = this.marshalOrderAttributes(queryOptions, ['createdAt'])
    const orderAttributes = [['objective', objectiveOrderAttributes]]

    const objectives = await this.corePorts.dispatchCommand<Objective[]>(
      'get-team-objectives',
      team.id,
      filters,
      orderAttributes,
    )
    const supportObjectives = await this.corePorts.dispatchCommand<Objective[]>(
      'get-team-support-objectives',
      team.id,
      filters,
      orderAttributes,
    )

    const allObjectives = uniqBy([...objectives, ...supportObjectives], 'id')

    return this.relay.marshalResponse<ObjectiveInterface>(allObjectives, connection, team)
  }

  @ResolveField('keyResults', () => TeamKeyResultsGraphQLConnection, { nullable: true })
  protected async getKeyResultsForTeam(
    @Args() request: KeyResultFiltersRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      userWithContext,
      request,
      message: 'Fetching key-results for team',
    })

    const [options, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultFiltersRequest,
      KeyResult
    >(request)
    const { confidence, active, ...filters } = options

    const keyResults = await this.corePorts.dispatchCommand<KeyResult[]>(
      'get-key-results',
      userWithContext,
      filters,
      queryOptions,
      active,
      confidence,
    )

    return this.relay.marshalResponse<KeyResultInterface>(keyResults, connection)
  }

  @ResolveField('delta', () => DeltaGraphQLObject)
  protected async getDeltaForTeam(
    @Parent() team: TeamGraphQLNode,
    @Args() request: TeamStatusRequest,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching delta for this team',
    })

    const result = await this.corePorts.dispatchCommand<Delta>('get-team-delta', team.id, request)
    if (!result)
      throw new UserInputError(`We could not find a delta for the team with ID ${team.id}`)

    return result
  }

  @ResolveField('tacticalCycle', () => CycleGraphQLNode, { nullable: true })
  protected async getTacticalCycleForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching tactical cycle for this team',
    })

    return this.corePorts.dispatchCommand<Cycle | undefined>('get-team-tactical-cycle', team.id)
  }
}
