import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args, ResolveField } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { CompanyOverviewProvider } from '@core/modules/mission-control/overview//company/company-overview.provider'
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
import { UsersGraphQLConnection } from '../users/users.connection'

import { QuantityNode } from './requests/quantity-request'
import { TeamAndUserRequest } from './requests/team-and-user.request'
import { TeamAndUsersRequest } from './requests/team-and-users.request'
import { UserTeamsGraphQLConnection } from './user-teams.connection'

@GuardedResolver(UserTeamsGraphQLConnection)
export class UserTeamsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<Team, TeamInterface> {
  private readonly logger = new Logger(UserTeamsConnectionGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    private readonly corePorts: CorePortsProvider,
    accessControl: UserAccessControl,
    private readonly companyOverviewProvider: CompanyOverviewProvider,
  ) {
    super(Resource.TEAM, core, core.team, accessControl)
  }

  @GuardedMutation(UserGraphQLNode, 'user:update', { name: 'addTeamToUser' })
  protected async addTeamToUserForRequestAndRequestUserWithContext(
    @Args() request: TeamAndUserRequest,
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

  @GuardedMutation(UsersGraphQLConnection, 'user:update', { name: 'addTeamToUsers' })
  protected async addTeamToUsersForRequestAndRequestUserWithContext(
    @Args() request: TeamAndUsersRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      userWithContext,
      request,
      message: 'Received add team to users request',
    })

    const [{ usersIDs: usersToAddTeam, teamID }, __, connection] = this.relay.unmarshalRequest<
      TeamAndUsersRequest,
      User
    >(request)

    const usersWithAddedTeamsPromises = usersToAddTeam.map(async (userID) => {
      const userRequest = {
        userID,
        teamID,
      }

      return this.addTeamToUserForRequestAndRequestUserWithContext(userRequest, userWithContext)
    })

    const usersWithAddedTeams = await Promise.all(usersWithAddedTeamsPromises)
    return this.relay.marshalResponse<User>(usersWithAddedTeams, connection)
  }

  @GuardedMutation(UserGraphQLNode, 'user:update', { name: 'removeTeamFromUser' })
  protected async removeTeamFromUserForRequestAndRequestUserWithContext(
    @Args() request: TeamAndUserRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      userWithContext,
      request,
      message: 'Received remove team to user request',
    })

    const canUpdate = await this.accessControl.canUpdate(userWithContext, request.userID)
    if (!canUpdate) throw new UnauthorizedException()

    return this.corePorts.dispatchCommand<User>('remove-team-from-user', request)
  }

  @ResolveField('quantities', () => QuantityNode)
  protected async quantities(@RequestUserWithContext() userWithContext: UserWithContext) {
    this.logger.log({
      userWithContext,
      message: 'Quantities of the company',
    })

    const teamIds = userWithContext.teams.map((team) => team.id)

    const overview = await this.companyOverviewProvider.fromTeams({
      teamIds,
      okrMode: ['published', 'completed'],
      okrType: 'shared',
      cycleIsActive: true,
      include: ['objectives', 'keyResults', 'confidence'],
    })

    return {
      objectivesQuantity: overview.objectives,
      keyResultsQuantity: overview.keyResults,
      achieved: overview.confidence.achieved,
      high: overview.confidence.high,
      medium: overview.confidence.medium,
      low: overview.confidence.low,
      barrier: overview.confidence.barrier,
      deprioritized: overview.confidence.deprioritized,
    }
  }
}
