import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/policy/enums/resource.enum'
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
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { CycleGraphQLNode } from '@interface/graphql/modules/cycle/cycle.node'
import { ObjectiveBaseAccessControl } from '@interface/graphql/modules/objective/access-control/base.access-control'
import { ObjectiveTeamsGraphQLConnection } from '@interface/graphql/modules/objective/connections/objective-teams/objective-teams.connection'
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
import { ObjectivePublishRequest } from './requests/objective-publish.request'

@GuardedResolver(ObjectiveGraphQLNode)
export class ObjectiveGraphQLResolver extends GuardedNodeGraphQLResolver<
  Objective,
  ObjectiveInterface
> {
  constructor(
    protected readonly core: CoreProvider,
    protected readonly corePorts: CorePortsProvider,
    protected readonly accessControl: ObjectiveBaseAccessControl,
  ) {
    super(Resource.OBJECTIVE, core, core.objective, accessControl)
  }

  @GuardedQuery(ObjectiveGraphQLNode, 'objective:read', { name: 'objective' })
  protected async getObjectiveForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() authorizationUser: UserWithContext,
  ) {
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
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canUpdate = await this.accessControl.canUpdate(userWithContext, request.id)
    if (!canUpdate) throw new UnauthorizedException()

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
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const deleteResult = await this.corePorts.dispatchCommand('delete-objective', request.id)
    if (!deleteResult) throw new UserInputError('We could not delete your objective')

    return deleteResult
  }

  @GuardedMutation(ObjectiveGraphQLNode, 'objective:create', { name: 'createObjective' })
  protected async createObjectiveForRequestUsingState(
    @Args() request: ObjectiveCreateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canCreate = await this.accessControl.canCreate(
      userWithContext,
      request.data.teamId,
      request.data.ownerId,
    )
    if (!canCreate) throw new UnauthorizedException()
    const objective = await this.corePorts.dispatchCommand<Objective>('create-objective', {
      ...request.data,
    })
    if (!objective) throw new UserInputError(`We could not create your objective`)

    return objective
  }

  @ResolveField('owner', () => UserGraphQLNode)
  protected async getOwnerForObjective(@Parent() objective: ObjectiveGraphQLNode) {
    return this.core.user.getOne({ id: objective.ownerId })
  }

  @ResolveField('cycle', () => CycleGraphQLNode)
  protected async getCycleForObjective(@Parent() objective: ObjectiveGraphQLNode) {
    return this.core.cycle.getFromObjective(objective)
  }

  @ResolveField('team', () => TeamGraphQLNode, { nullable: true })
  protected async getTeamForObjective(@Parent() objective: ObjectiveGraphQLNode) {
    return this.corePorts.dispatchCommand<Team>('get-team', objective.teamId)
  }

  @ResolveField('supportTeams', () => ObjectiveTeamsGraphQLConnection, { nullable: true })
  protected async getSupportTeamsForObjective(
    @Args() request: TeamFiltersRequest,
    @Parent() objective: ObjectiveGraphQLNode,
  ) {
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
    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultFiltersRequest,
      KeyResult
    >(request)

    const keyResultOrderAttributes = this.marshalOrderAttributes(queryOptions, ['createdAt'])
    const orderAttributes = [['keyResult', keyResultOrderAttributes]]

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
    const result = await this.corePorts.dispatchCommand<Delta>('get-objective-delta', objective.id)
    if (!result)
      throw new UserInputError(
        `We could not find a delta for the objective with ID ${objective.id}`,
      )

    return result
  }

  @GuardedMutation(ObjectiveGraphQLNode, 'objective:update', { name: 'publishOkr' })
  protected async publishObjectiveAndKeyResultsForRequest(
    @Args() request: ObjectivePublishRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canPublish = await this.accessControl.canUpdate(userWithContext, request.id)
    if (!canPublish) throw new UnauthorizedException()
    const objective = await this.corePorts.dispatchCommand<Objective>(
      'publish-objective-and-key-results',
      request.id,
      userWithContext,
    )
    if (!objective)
      throw new UserInputError(`We could not found an objective with ID ${request.id}`)

    return objective
  }
}
