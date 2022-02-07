import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { WorkspaceGraphQLNode } from '@interface/graphql/modules/workspace/workspace.node'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

@GuardedResolver(WorkspaceGraphQLNode)
export class WorkspaceGraphQLResolver extends GuardedNodeGraphQLResolver<Team, TeamInterface> {
  private readonly logger = new Logger(WorkspaceGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    protected readonly corePorts: CorePortsProvider,
  ) {
    super(Resource.WORKSPACE, core, core.team)
  }

  @GuardedQuery(WorkspaceGraphQLNode, 'workspace:read', { name: 'workspace' })
  protected async getWorkspaceForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
  ) {
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
    if (!team)
      throw new UserInputError(`We could not found a workspace with the provided arguments`)

    return team
  }
}
