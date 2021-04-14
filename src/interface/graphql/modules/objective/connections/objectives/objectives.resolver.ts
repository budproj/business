import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-connection.resolver'

import { ObjectiveGraphQLNode } from '../../objective.node'
import { ObjectiveFiltersRequest } from '../../requests/objective-filters.request'

import { ObjectivesGraphQLConnection } from './objectives.connection'

@GuardedResolver(ObjectivesGraphQLConnection)
export class ObjectivesConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Objective,
  ObjectiveInterface,
  ObjectiveGraphQLNode
> {
  private readonly logger = new Logger(ObjectivesConnectionGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.OBJECTIVE, core, core.objective)
  }

  @GuardedQuery(ObjectivesGraphQLConnection, 'objective:read', { name: 'objectives' })
  protected async getObjectivesForRequestAndAuthorizedRequestUser(
    @Args() request: ObjectiveFiltersRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizationUser,
      message: 'Fetching objectives with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      ObjectiveFiltersRequest,
      Objective
    >(request)

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      authorizationUser,
      queryOptions,
    )

    return this.relay.marshalResponse<Objective>(queryResult, connection)
  }
}
