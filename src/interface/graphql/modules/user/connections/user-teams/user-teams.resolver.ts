import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'

import { UserAccessControl } from '../../user.access-control'
import { UserGraphQLNode } from '../../user.node'

import { AddTeamtoUserRequest } from './requests/user-update.request'
import { UserTeamsGraphQLConnection } from './user-teams.connection'

@GuardedResolver(UserTeamsGraphQLConnection)
export class UserTeamsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Team,
  TeamInterface
> {
  private readonly logger = new Logger(UserTeamsConnectionGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    private readonly corePorts: CorePortsProvider,
    accessControl: UserAccessControl,
  ) {
    super(Resource.TEAM, core, core.team, accessControl)
  }

  @GuardedMutation(UserGraphQLNode, 'user:update', { name: 'addTeamToUser' })
  protected async addTeamToUserForRequestAndRequestUserWithContext(
    @Args() request: AddTeamtoUserRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      userWithContext,
      request,
      message: 'Received add team to user request',
    })

    const canUpdate = await this.accessControl.canUpdate(userWithContext, request.userID)
    if (!canUpdate) throw new UnauthorizedException()

    return this.corePorts.dispatchCommand<User>('add-team-to-user', request)
  }
}
