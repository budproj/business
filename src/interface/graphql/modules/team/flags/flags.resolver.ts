import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { TeamFlag } from '@core/interfaces/team-flag.interface '
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'

import { FlagsAccessControl } from './flags.access-control'
import { FlagsGraphQLNode } from './flags.node'
import { TeamFlagsRequest } from './requests/team-flags.request'

@GuardedResolver(FlagsGraphQLNode)
export class FlagsGraphQLResolver extends GuardedNodeGraphQLResolver<Team, TeamInterface> {
  private readonly logger = new Logger(FlagsGraphQLResolver.name)

  constructor(
    protected corePorts: CorePortsProvider,
    protected accessControl: FlagsAccessControl,
    core: CoreProvider,
  ) {
    super(Resource.FLAGS, core, core.team, accessControl)
  }

  @GuardedQuery(FlagsGraphQLNode, 'flags:read', { name: 'getTeamFlags' })
  protected async getTeamForRequestAndRequestUserWithContext(
    @Args() request: TeamFlagsRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canRead = await this.accessControl.canRead(userWithContext, request.id)
    if (!canRead) throw new UnauthorizedException()

    this.logger.log({
      request,
      message: 'Fetching users for team',
    })

    const [, _, connection] = this.relay.unmarshalRequest<TeamFlagsRequest, User>(request)

    const { outdated, barrier, low, noRelated } = await this.corePorts.dispatchCommand<TeamFlag>(
      'get-team-flags',
      request.id,
    )

    const teamFlags = {
      outdated: this.relay.marshalResponse<KeyResult>(outdated, connection),
      barrier: this.relay.marshalResponse<KeyResult>(barrier, connection),
      low: this.relay.marshalResponse<KeyResult>(low, connection),
      noRelated: this.relay.marshalResponse<User>(noRelated, connection),
    }

    return teamFlags
  }
}
