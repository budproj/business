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
import { TeamFlagsObject } from './objects/team-flags.object'
import { TeamFlagsRequest } from './requests/team-flags.request'

@GuardedResolver(FlagsGraphQLNode)
export class FlagsGraphQLResolver extends GuardedNodeGraphQLResolver<Team, TeamInterface> {

  constructor(
    protected corePorts: CorePortsProvider,
    protected accessControl: FlagsAccessControl,
    core: CoreProvider,
  ) {
    super(Resource.FLAGS, core, core.team, accessControl)
  }

  @GuardedQuery(TeamFlagsObject, 'flags:read', { name: 'getTeamFlags' })
  protected async getTeamFlagsForRequestAndRequestUserWithContext(
    @Args() request: TeamFlagsRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canRead = await this.accessControl.canRead(userWithContext, request.id)
    if (!canRead) throw new UnauthorizedException()

    const { outdated, low, noRelated, barrier } = await this.corePorts.dispatchCommand<TeamFlag>(
      'get-team-flags',
      request.id,
    )

    const teamFlagsByQuantity = {
      outdatedLength: outdated.length,
      lowLength: low.length,
      noRelatedLength: noRelated.length,
      barrierLength: barrier.length,
    }

    return teamFlagsByQuantity
  }

  @GuardedQuery(FlagsGraphQLNode, 'flags:read', { name: 'getTeamFlagsData' })
  protected async getTeamFlagsDataForRequestAndRequestUserWithContext(
    @Args() request: TeamFlagsRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canRead = await this.accessControl.canRead(userWithContext, request.id)
    if (!canRead) throw new UnauthorizedException()

    const [, _, connection] = this.relay.unmarshalRequest<TeamFlagsRequest, User>(request)

    const { outdated, barrier, low, noRelated } = await this.corePorts.dispatchCommand<TeamFlag>(
      'get-team-flags',
      request.id,
      { ...request },
    )

    const teamFlagsData = {
      outdated: this.relay.marshalResponse<KeyResult>(outdated, connection),
      barrier: this.relay.marshalResponse<KeyResult>(barrier, connection),
      low: this.relay.marshalResponse<KeyResult>(low, connection),
      noRelated: this.relay.marshalResponse<User>(noRelated, connection),
    }

    return teamFlagsData
  }
}
