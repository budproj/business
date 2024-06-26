import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { UserStatus } from '@core/modules/user/enums/user-status.enum'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { Cacheable } from "@lib/cache/cacheable.decorator";

import { UserFiltersRequest } from '../../requests/user-filters.request'

import { UsersGraphQLConnection } from './users.connection'

@GuardedResolver(UsersGraphQLConnection)
export class UsersConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  User,
  UserInterface
> {
  constructor(
    protected readonly core: CoreProvider,
    private readonly corePorts: CorePortsProvider,
  ) {
    super(Resource.USER, core, core.user)
  }

  @Cacheable((request, user) => [user.id, request], 5 * 60)
  @GuardedQuery(UsersGraphQLConnection, 'user:read', { name: 'users' })
  protected async getUsersForRequestAndRequestUserWithContext(
    @Args() request: UserFiltersRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const [rawFilters, queryOptions, connection] = this.relay.unmarshalRequest<
      UserFiltersRequest,
      User
    >(request)

    // Caso o filtro de OKR's individuais esteja ativo, os filters e as options não estão disponíveis por dificuldade de implementação na arquitetura atual do projeto. Foi mal futuro dev que vai ler isso!!

    if (rawFilters.onlyWithIndividualObjectives) {
      const usersWithIndividualOkr = await this.corePorts.dispatchCommand<User[]>(
        'get-users-with-individual-okr',
        userWithContext,
      )
      return this.relay.marshalResponse<User>(usersWithIndividualOkr, connection)
    }

    const filters = rawFilters.withInactives
      ? {
          ...rawFilters,
        }
      : { ...rawFilters, status: UserStatus.ACTIVE }

    delete filters.onlyWithIndividualObjectives
    delete filters.withInactives

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      userWithContext,
      queryOptions,
    )

    return this.relay.marshalResponse<User>(queryResult, connection)
  }
}
