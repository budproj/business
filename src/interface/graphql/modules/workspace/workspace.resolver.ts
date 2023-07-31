import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { WorkspaceCreateRequest } from '@interface/graphql/modules/workspace/requests/workspace-create.request'
import { WorkspaceAccessControl } from '@interface/graphql/modules/workspace/workspace.access-control'
import { WorkspaceGraphQLNode } from '@interface/graphql/modules/workspace/workspace.node'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

@GuardedResolver(WorkspaceGraphQLNode)
export class WorkspaceGraphQLResolver extends GuardedNodeGraphQLResolver<Team, TeamInterface> {
  private readonly logger = new Logger(WorkspaceGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    protected readonly corePorts: CorePortsProvider,
    readonly accessControl: WorkspaceAccessControl,
  ) {
    super(Resource.WORKSPACE, core, core.team, accessControl)
  }

  @GuardedQuery(WorkspaceGraphQLNode, 'workspace:read', { name: 'workspace' })
  protected async getWorkspaceForRequestAndRequestUserWithContext(@Args() request: NodeIndexesRequest) {
    this.logger.log({
      request,
      message: 'Fetching workspace with provided indexes',
    })

    const indexes = {
      ...request,
      // eslint-disable-next-line unicorn/no-null
      parentId: null,
    }

    const team = await this.corePorts.dispatchCommand<Team>('get-team', indexes)
    if (!team) throw new UserInputError(`We could not found a workspace with the provided arguments`)

    return team
  }

  @GuardedMutation(WorkspaceGraphQLNode, 'workspace:create', { name: 'createWorkspace' })
  protected async createWorkspaceForRequestAndRequestUserWithContext(
    @Args() request: WorkspaceCreateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canCreate = await this.accessControl.canCreate(userWithContext)
    if (!canCreate) throw new UnauthorizedException()

    this.logger.log({
      userWithContext,
      request,
      message: 'Received create workspace request',
    })

    const rootUser = await this.corePorts.dispatchCommand<User>('create-user', request.data.user, {
      autoInvite: request.data.options.autoInvite,
    })
    const team = await this.corePorts.dispatchCommand<Team>('create-team', {
      ...request.data.team,
      ownerId: rootUser.id,
    })
    await this.corePorts.dispatchCommand('add-team-to-user', {
      userID: rootUser.id,
      teamID: team.id,
    })

    const yearlyCycle = await this.corePorts.dispatchCommand<Cycle>('create-cycle', {
      period: request.data.yearlyCycle.period,
      cadence: Cadence.YEARLY,
      dateStart: request.data.yearlyCycle.dateStart,
      dateEnd: request.data.yearlyCycle.dateEnd,
      teamId: team.id,
    })

    await this.corePorts.dispatchCommand<Cycle>('create-cycle', {
      period: request.data.quarterlyCycle.period,
      cadence: Cadence.QUARTERLY,
      dateStart: request.data.quarterlyCycle.dateStart,
      dateEnd: request.data.quarterlyCycle.dateEnd,
      teamId: team.id,
      parentId: yearlyCycle.id,
    })

    return team
  }
}
