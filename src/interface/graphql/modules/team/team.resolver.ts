import {
  InternalServerErrorException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common'
import { Args, Parent, ResolveField, Info } from '@nestjs/graphql'
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
import { GetKeyResultsOutput } from '@core/modules/key-result/key-result.provider'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserStatus } from '@core/modules/user/enums/user-status.enum'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { GetTeamMembersCommandResult } from '@core/ports/commands/get-team-members.command'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import GetResolvedFieldsInEdgesAndNodes, {
  ResolvedFieldInfo,
} from '@interface/graphql/helpers/get-resolved-fields-in-edges-and-nodes.helper'
import { CycleGraphQLNode } from '@interface/graphql/modules/cycle/cycle.node'
import { CycleFiltersRequest } from '@interface/graphql/modules/cycle/requests/cycle-filters.request'
import { ObjectiveFiltersRequest } from '@interface/graphql/modules/objective/requests/objective-filters.request'
import { TeamStatusRequest } from '@interface/graphql/modules/team/requests/team-status.request'
import { UserFiltersRequest } from '@interface/graphql/modules/user/requests/user-filters.request'
import { UserKeyResultsRequest } from '@interface/graphql/modules/user/requests/user-key-results.request'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { DeltaGraphQLObject } from '@interface/graphql/objects/delta.object'
import { StatusGraphQLObject } from '@interface/graphql/objects/status.object'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'
import { Cacheable } from '@lib/cache/cacheable.decorator'
import { Stopwatch } from '@lib/logger/pino.decorator'

import { QuantityNode } from '../user/connections/user-teams/requests/quantity-request'

import { TeamCyclesGraphQLConnection } from './connections/team-cycles/team-cycles.connection'
import { TeamKeyResultsGraphQLConnection } from './connections/team-key-results/team-key-results.connection'
import { TeamObjectivesGraphQLConnection } from './connections/team-objectives/team-objectives.connection'
import { TeamTeamsGraphQLConnection } from './connections/team-teams/team-teams.connection'
import { TeamUsersGraphQLConnection } from './connections/team-users/team-users.connection'
import { TeamCreateRequest } from './requests/team-create.request'
import { TeamFiltersRequest } from './requests/team-filters.request'
import { TeamMembersFiltersRequest } from './requests/team-members-filters.request'
import { TeamUpdateRequest } from './requests/team-update.request'
import { TeamAccessControl } from './team.access-control'
import { TeamGraphQLNode } from './team.node'

@GuardedResolver(TeamGraphQLNode)
export class TeamGraphQLResolver extends GuardedNodeGraphQLResolver<Team, TeamInterface> {
  constructor(
    protected readonly core: CoreProvider,
    protected readonly corePorts: CorePortsProvider,
    protected readonly accessControl: TeamAccessControl,
  ) {
    super(Resource.TEAM, core, core.team, accessControl)
  }

  @Stopwatch()
  @GuardedQuery(TeamGraphQLNode, 'team:read', { name: 'team' })
  protected async getTeamForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
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

    const payload = {
      name: data.name,
      description: data.description,
      gender: data.gender,
      ownerId: data.ownerID,
      parentId: parentID,
    }

    const createdTeam = await this.corePorts.dispatchCommand<Team>('create-team', payload)
    if (!createdTeam) throw new InternalServerErrorException('We were not able to create your team')

    return createdTeam
  }

  @GuardedMutation(TeamGraphQLNode, 'team:update', { name: 'updateTeam' })
  protected async updateTeamForRequestAndRequestUserWithContext(
    @Args() request: TeamUpdateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canUpdate = await this.accessControl.canUpdate(userWithContext, request.id)
    if (!canUpdate) throw new UnauthorizedException()

    const updatedTeam = await this.corePorts.dispatchCommand<Team>('update-team', request.id, {
      ...request.data,
    })

    if (!updatedTeam) throw new InternalServerErrorException('We were not able to update your team')

    return updatedTeam
  }

  @Stopwatch()
  @ResolveField('status', () => StatusGraphQLObject)
  protected async getStatusForCycle(
    @Parent() team: TeamGraphQLNode,
    @Args() request: TeamStatusRequest,
  ) {
    if (team.status) return team.status

    const result = await this.corePorts.dispatchCommand<Status>('get-team-status', team.id, request)
    if (!result)
      throw new UserInputError(`We could not find status for the team with ID ${team.id}`)

    return result
  }

  @Cacheable('0.ownerId', 60 * 60)
  @Stopwatch()
  @ResolveField('owner', () => UserGraphQLNode)
  protected async getOwnerForTeam(@Parent() team: TeamGraphQLNode) {
    return this.core.user.getOne({ id: team.ownerId })
  }

  @Cacheable((request, team) => [team.id, request], 1 * 60)
  @Stopwatch()
  @ResolveField('teams', () => TeamTeamsGraphQLConnection, { nullable: true })
  protected async getChildTeamsForTeam(
    @Args() request: TeamFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      TeamFiltersRequest,
      Team
    >(request)

    const queryResult = await this.core.team.getChildren(team.id, filters, queryOptions)

    return this.relay.marshalResponse<TeamInterface>(queryResult, connection, team)
  }

  @Cacheable((request, team) => [team.id, request], 15 * 60)
  @Stopwatch()
  @ResolveField('rankedDescendants', () => TeamTeamsGraphQLConnection, { nullable: true })
  protected async getRankedDescendantsForTeam(
    @Args() request: TeamFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
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

  @Cacheable('0.parentId', 60 * 60)
  @Stopwatch()
  @ResolveField('parent', () => TeamGraphQLNode, { nullable: true })
  protected async getParentForTeam(@Parent() team: TeamGraphQLNode) {
    return this.core.team.getOne({ id: team.parentId })
  }

  @Cacheable(
    (request, team, info) => [team.id, request, GetResolvedFieldsInEdgesAndNodes(info)],
    1 * 60,
  )
  @Stopwatch({ omitArgs: '2' })
  @ResolveField('users', () => TeamUsersGraphQLConnection, { nullable: true })
  protected async getUsersForTeam(
    @Args() request: TeamMembersFiltersRequest,
    @Parent() team: TeamGraphQLNode,
    @Info() info: ResolvedFieldInfo,
  ) {
    const [rawFilters, getOptions, connection] = this.relay.unmarshalRequest<
      UserFiltersRequest,
      User
    >(request)

    const requestedFields = GetResolvedFieldsInEdgesAndNodes(info)

    if (
      (requestedFields.has('lastRoutine') || requestedFields.has('latestCheckIn')) &&
      !rawFilters.withIndicators
    ) {
      throw new NotImplementedException(
        'You are trying to fetch lastRoutine or latestCheckIn without the withIndicators filter.',
      )
    }

    if (rawFilters.allUsers && !rawFilters.withIndicators) {
      throw new NotImplementedException(
        'You are trying to fetch with the allUsers filter but that filter is only used with withIndicators filter.',
      )
    }

    if (rawFilters.withIndicators) {
      const queryResult = await this.corePorts.dispatchCommand<User[]>(
        'get-team-score',
        team.id,
        rawFilters.allUsers,
      )

      return this.relay.marshalResponse(queryResult, connection, team)
    }

    const filters = rawFilters.withInactives
      ? { ...rawFilters }
      : { ...rawFilters, status: UserStatus.ACTIVE }

    delete filters.withInactives
    delete filters.withIndicators
    delete filters.allUsers

    const { users } = await this.corePorts.dispatchCommand<GetTeamMembersCommandResult>(
      'get-team-members',
      team.id,
      filters,
      getOptions,
    )

    return this.relay.marshalResponse<UserInterface>(users, connection, team)
  }

  @ResolveField('isCompany', () => Boolean)
  protected async getIsCompanyForTeam(@Parent() team: TeamGraphQLNode) {
    return this.core.team.specification.isACompany.isSatisfiedBy(team)
  }

  @Cacheable((request, team) => [team.id, request], 5 * 60)
  @Stopwatch()
  @ResolveField('cycles', () => TeamCyclesGraphQLConnection, { nullable: true })
  protected async getCyclesForTeam(
    @Args() request: CycleFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      CycleFiltersRequest,
      Cycle
    >(request)

    const queryResult = await this.core.cycle.getFromTeamsWithFilters([team], filters, queryOptions)

    return this.relay.marshalResponse<CycleInterface>(queryResult, connection, team)
  }

  @Stopwatch()
  @ResolveField('objectives', () => TeamObjectivesGraphQLConnection, { nullable: true })
  protected async getObjectivesForRequestAndUser(
    @Args() request: ObjectiveFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
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

  @Stopwatch()
  @ResolveField('supportObjectives', () => TeamObjectivesGraphQLConnection, { nullable: true })
  protected async getSupportObjectivesForRequestAndUser(
    @Args() request: ObjectiveFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
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

  @Stopwatch()
  @ResolveField('allObjectives', () => TeamObjectivesGraphQLConnection, { nullable: true })
  protected async getAllObjectivesForRequestAndUser(
    @Args() request: ObjectiveFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      ObjectiveFiltersRequest,
      Objective
    >(request)

    const objectiveOrderAttributes = this.marshalOrderAttributes(queryOptions, ['createdAt'])
    const orderAttributes = [['objective', objectiveOrderAttributes]]

    // TODO: merge both queries into one with filter
    // TODO: { $or: [{ keyResult: { teamId } }, { objective: { teamId } }] }
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

  @Stopwatch()
  @ResolveField('keyResults', () => TeamKeyResultsGraphQLConnection, { nullable: true })
  protected async getKeyResultsForTeam(
    @Args() request: UserKeyResultsRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    const [options, _, connection] = this.relay.unmarshalRequest<UserKeyResultsRequest, KeyResult>(
      request,
    )

    const { confidence, active, ...filters } = options

    const { keyResults, totalCount } = await this.corePorts.dispatchCommand<GetKeyResultsOutput>(
      'get-key-results',
      team,
      filters,
      active,
      confidence,
    )

    const hasMoreToLoad = filters.limit + filters.offset < totalCount

    const marshalResponde = this.relay.marshalResponse<KeyResultInterface>(
      keyResults,
      connection,
      team,
      hasMoreToLoad,
    )

    return marshalResponde
  }

  @Cacheable((team, request) => [team.id, request], 15 * 60)
  @Stopwatch()
  @ResolveField('delta', () => DeltaGraphQLObject)
  protected async getDeltaForTeam(
    @Parent() team: TeamGraphQLNode,
    @Args() request: TeamStatusRequest,
  ) {
    if (team.delta) return team.delta

    const result = await this.corePorts.dispatchCommand<Delta>('get-team-delta', team.id, request)
    if (!result)
      throw new UserInputError(`We could not find a delta for the team with ID ${team.id}`)

    return result
  }

  @Cacheable('0.id', 5 * 60)
  @Stopwatch()
  @ResolveField('tacticalCycle', () => CycleGraphQLNode, { nullable: true })
  protected async getTacticalCycleForTeam(@Parent() team: TeamGraphQLNode) {
    if (team.tacticalCycle) return team.tacticalCycle

    return this.corePorts.dispatchCommand<Cycle | undefined>('get-team-tactical-cycle', team.id)
  }

  @ResolveField('quantities', () => QuantityNode)
  protected async quantities(
    @RequestUserWithContext() userWithContext: UserWithContext,
    @Parent() team: TeamGraphQLNode,
  ) {
    const data = await this.corePorts.dispatchCommand(
      'get-objectives-and-key-results-quantities',
      userWithContext,
      team.id,
    )

    return data
  }
}
