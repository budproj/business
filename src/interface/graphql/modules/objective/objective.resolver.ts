import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args, Float, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { State } from '@adapters/state/interfaces/state.interface'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Status } from '@core/interfaces/status.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestState } from '@interface/graphql/adapters/context/decorators/request-state.decorator'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { CycleGraphQLNode } from '@interface/graphql/modules/cycle/cycle.node'
import { ObjectiveAccessControl } from '@interface/graphql/modules/objective/objective.access-control'
import { ObjectiveUpdateRequest } from '@interface/graphql/modules/objective/requests/objective-update.request'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { DeleteResultGraphQLObject } from '@interface/graphql/objects/delete-result.object'
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

    const queryResult = await this.core.keyResult.getFromObjective(objective, filters, queryOptions)

    return this.relay.marshalResponse<KeyResultInterface>(queryResult, connection, objective)
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

  @ResolveField('progressIncreaseSinceLastWeek', () => Float)
  protected async getProgressIncreaseSinceLastWeekForObjective(
    @Parent() objective: ObjectiveGraphQLNode,
  ) {
    this.logger.log({
      objective,
      message: 'Fetching progress increase for objective since last week',
    })

    return this.core.objective.getObjectiveProgressIncreaseSinceLastWeek(objective)
  }
}
