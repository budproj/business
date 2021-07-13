import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { State } from '@adapters/state/interfaces/state.interface'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Delta } from '@core/interfaces/delta.interface'
import { Status } from '@core/interfaces/status.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestState } from '@interface/graphql/adapters/context/decorators/request-state.decorator'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { CycleGraphQLNode } from '@interface/graphql/modules/cycle/cycle.node'
import { ObjectiveTeamsGraphQLConnection } from '@interface/graphql/modules/objective/connections/objective-teams/objective-teams.connection'
import { ObjectiveAccessControl } from '@interface/graphql/modules/objective/objective.access-control'
import { ObjectiveCreateRequest } from '@interface/graphql/modules/objective/requests/objective-create.request'
import { ObjectiveUpdateRequest } from '@interface/graphql/modules/objective/requests/objective-update.request'
import { TeamFiltersRequest } from '@interface/graphql/modules/team/requests/team-filters.request'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { DeleteResultGraphQLObject } from '@interface/graphql/objects/delete-result.object'
import { DeltaGraphQLObject } from '@interface/graphql/objects/delta.object'
import { StatusGraphQLObject } from '@interface/graphql/objects/status.object'
import { NodeDeleteRequest } from '@interface/graphql/requests/node-delete.request'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'
import { StatusRequest } from '@interface/graphql/requests/status.request'

import { KeyResultFiltersRequest } from '../key-result/requests/key-result-filters.request'

import { ObjectiveKeyResultsGraphQLConnection } from './connections/objective-key-results/objective-key-results.connection'
import { ObjectiveGraphQLNode } from './objective.node'

@GuardedResolver(ObjectiveGraphQLNode)
export class ObjectiveGraphQLResolver extends GuardedNodeGraphQLResolver<
  Objective,
  ObjectiveInterface
> {
  private readonly logger = new Logger(ObjectiveGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    protected readonly corePorts: CorePortsProvider,
    accessControl: ObjectiveAccessControl,
  ) {
    super(Resource.OBJECTIVE, core, core.objective, accessControl)
  }

  @GuardedQuery(ObjectiveGraphQLNode, 'objective:read', { name: 'objective' })
  protected async getObjectiveForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() authorizationUser: UserWithContext,
  ) {
    this.logger.log({
      request,
      message: 'Fetching objective with provided indexes',
    })

    const objective = await this.queryGuard.getOneWithActionScopeConstraint(
      request,
      authorizationUser,
    )
    if (!objective)
      throw new UserInputError(`We could not found an objective with the provided arguments`)

    return objective
  }

  @GuardedMutation(ObjectiveGraphQLNode, 'objective:update', { name: 'updateObjective' })
  protected async updateObjectiveForRequestAndRequestUserWithContext(
    @Args() request: ObjectiveUpdateRequest,
    @RequestState() state: State,
  ) {
    const canUpdate = await this.accessControl.canUpdate(state.user, request.id)
    if (!canUpdate) throw new UnauthorizedException()

    this.logger.log({
      state,
      request,
      message: 'Received update objective request',
    })

    const objective = await this.corePorts.dispatchCommand<KeyResult>(
      'update-objective',
      request.id,
      { ...request.data },
    )
    if (!objective)
      throw new UserInputError(`We could not found an objective with ID ${request.id}`)

    return objective
  }

  @GuardedMutation(DeleteResultGraphQLObject, 'objective:delete', { name: 'deleteObjective' })
  protected async deleteObjectiveForRequestUsingState(
    @Args() request: NodeDeleteRequest,
    @RequestState() state: State,
  ) {
    const canDelete = await this.accessControl.canDelete(state.user, request.id)
    if (!canDelete) throw new UnauthorizedException()

    this.logger.log({
      state,
      request,
      message: 'Received delete objective request',
    })

    const deleteResult = await this.corePorts.dispatchCommand('delete-objective', request.id)
    if (!deleteResult) throw new UserInputError('We could not delete your objective')

    return deleteResult
  }

  @GuardedMutation(ObjectiveGraphQLNode, 'objective:create', { name: 'createObjective' })
  protected async createObjectiveForRequestUsingState(
    @Args() request: ObjectiveCreateRequest,
    @RequestState() state: State,
  ) {
    const canCreate = await this.accessControl.canCreate(state.user, request.data.teamId)
    if (!canCreate) throw new UnauthorizedException()

    this.logger.log({
      state,
      request,
      message: 'Received create objective request',
    })

    const objective = await this.corePorts.dispatchCommand<Objective>('create-objective', {
      ...request.data,
    })
    if (!objective) throw new UserInputError(`We could not create your objective`)

    return objective
  }

  @ResolveField('owner', () => UserGraphQLNode)
  protected async getOwnerForObjective(@Parent() objective: ObjectiveGraphQLNode) {
    this.logger.log({
      objective,
      message: 'Fetching owner for objective',
    })

    return this.core.user.getOne({ id: objective.ownerId })
  }

  @ResolveField('cycle', () => CycleGraphQLNode)
  protected async getCycleForObjective(@Parent() objective: ObjectiveGraphQLNode) {
    this.logger.log({
      objective,
      message: 'Fetching cycle for objective',
    })

    return this.core.cycle.getFromObjective(objective)
  }

  @ResolveField('team', () => TeamGraphQLNode, { nullable: true })
  protected async getTeamForObjective(@Parent() objective: ObjectiveGraphQLNode) {
    this.logger.log({
      objective,
      message: 'Fetching team for objective',
    })

    return this.corePorts.dispatchCommand<Team>('get-team', objective.teamId)
  }

  @ResolveField('supportTeams', () => ObjectiveTeamsGraphQLConnection, { nullable: true })
  protected async getSupportTeamsForObjective(
    @Args() request: TeamFiltersRequest,
    @Parent() objective: ObjectiveGraphQLNode,
  ) {
    this.logger.log({
      objective,
      request,
      message: 'Fetching support teams for objective',
    })

    const [_, __, connection] = this.relay.unmarshalRequest<TeamFiltersRequest, Team>(request)

    const queryResult = await this.corePorts.dispatchCommand<Team[]>(
      'get-objective-support-teams',
      objective.id,
    )

    return this.relay.marshalResponse<Team>(queryResult, connection, objective)
  }

  @ResolveField('keyResults', () => ObjectiveKeyResultsGraphQLConnection, { nullable: true })
  protected async getKeyResultsForObjective(
    @Args() request: KeyResultFiltersRequest,
    @Parent() objective: ObjectiveGraphQLNode,
  ) {
    this.logger.log({
      objective,
      request,
      message: 'Fetching key-results for objective',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultFiltersRequest,
      KeyResult
    >(request)
    const orderAttributes = this.marshalOrderAttributes(queryOptions, ['createdAt'])

    const keyResults = await this.corePorts.dispatchCommand<KeyResult[]>(
      'get-objective-key-results',
      objective.id,
      filters,
      orderAttributes,
    )

    return this.relay.marshalResponse<KeyResultInterface>(keyResults, connection, objective)
  }

  @ResolveField('status', () => StatusGraphQLObject)
  protected async getStatusForObjective(
    @Parent() objective: ObjectiveGraphQLNode,
    @Args() request: StatusRequest,
  ) {
    this.logger.log({
      objective,
      request,
      message: 'Fetching current status for this objective',
    })

    const result = await this.corePorts.dispatchCommand<Status>(
      'get-objective-status',
      objective.id,
      request,
    )
    if (!result)
      throw new UserInputError(`We could not find status for the objective with ID ${objective.id}`)

    return result
  }

  @ResolveField('delta', () => DeltaGraphQLObject)
  protected async getDeltaForObjective(@Parent() objective: ObjectiveGraphQLNode) {
    this.logger.log({
      objective,
      message: 'Fetching delta for this objective',
    })

    const result = await this.corePorts.dispatchCommand<Delta>('get-objective-delta', objective.id)
    if (!result)
      throw new UserInputError(
        `We could not find a delta for the objective with ID ${objective.id}`,
      )

    return result
  }
}
