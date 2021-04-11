import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckInInterface } from '@core/modules/key-result/modules/check-in//key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/modules/check-in//key-result-check-in.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-connection.resolver'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/objects/key-result/check-in/key-result-check-in.node'
import { KeyResultCheckInsGraphQLConnection } from '@interface/graphql/objects/key-result/check-in/key-result-check-ins.connection'
import { NourishUserDataInterceptor } from '@interface/graphql/resolvers/interceptors/nourish-user-data.interceptor'

import { KeyResultCheckInFiltersRequest } from '../requests/key-result-check-in-filters.request'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => KeyResultCheckInsGraphQLConnection)
export class KeyResultCheckInsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResultCheckIn,
  KeyResultCheckInInterface,
  KeyResultCheckInGraphQLNode
> {
  private readonly logger = new Logger(KeyResultCheckInsConnectionGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT_CHECK_IN, core, core.keyResult.keyResultCheckInProvider)
  }

  @RequiredActions('key-result-check-in:read')
  @Query(() => KeyResultCheckInsGraphQLConnection, { name: 'keyResultCheckIns' })
  protected async getKeyResultCheckIns(
    @Args() request: KeyResultCheckInFiltersRequest,
    @AuthorizedRequestUser()
    authorizedRequestKeyResultCheckIn: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizedRequestKeyResultCheckIn,
      message: 'Fetching key-result check-ins with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultCheckInFiltersRequest,
      KeyResultCheckIn
    >(request)

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      authorizedRequestKeyResultCheckIn,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResultCheckIn>(queryResult, connection)
  }
}
