import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args } from '@nestjs/graphql'
import { Role } from 'auth0'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'

import { ObjectiveFiltersRequest } from '../../requests/objective-filters.request'

import { ObjectivesGraphQLConnection } from './objectives.connection'

@GuardedResolver(ObjectivesGraphQLConnection)
export class ObjectivesConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Objective,
  ObjectiveInterface
> {
  private readonly logger = new Logger(ObjectivesConnectionGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    private readonly corePorts: CorePortsProvider,
  ) {
    super(Resource.OBJECTIVE, core, core.objective)
  }

  @GuardedQuery(ObjectivesGraphQLConnection, 'objective:read', { name: 'objectives' })
  protected async getObjectivesForRequestAndRequestUserWithContext(
    @Args() request: ObjectiveFiltersRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      userWithContext,
      message: 'Fetching objectives with filters',
    })

    const { teamId, ownerId } = request

    const requestedUserAuthzRole = await this.corePorts.dispatchCommand<Role>(
      'get-user-role',
      userWithContext.id,
    )
    const cantGetObjectives =
      !teamId &&
      ['Squad Member', 'Team Member'].includes(requestedUserAuthzRole.name) &&
      userWithContext.id !== ownerId

    if (cantGetObjectives) throw new UnauthorizedException()

    const [options, _, connection] = this.relay.unmarshalRequest<
      ObjectiveFiltersRequest,
      Objective
    >(request)
    const { active, ...filters } = options
    const command = 'get-objectives'

    const queryResult = await this.corePorts.dispatchCommand<Objective[]>(command, filters, {
      active,
    })

    return this.relay.marshalResponse<Objective>(queryResult, connection)
  }
}
