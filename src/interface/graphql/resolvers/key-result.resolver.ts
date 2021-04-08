import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { KeyResultInterface } from '@core/modules/key-result/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultNodeGraphQLObject } from '@interface/graphql/objects/key-result/key-result-node.object'
import { KeyResultQueryResultGraphQLObject } from '@interface/graphql/objects/key-result/key-result-query.object'
import { KeyResultFiltersRequest } from '@interface/graphql/requests/key-result/key-result.request'

import { BaseGraphQLResolver } from './base.resolver'
import { GraphQLUser } from './decorators/graphql-user'
import { GraphQLRequiredPoliciesGuard } from './guards/required-policies.guard'
import { GraphQLTokenGuard } from './guards/token.guard'
import { NourishUserDataInterceptor } from './interceptors/nourish-user-data.interceptor'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => KeyResultNodeGraphQLObject)
export class KeyResultGraphQLResolver extends BaseGraphQLResolver<KeyResult, KeyResultInterface> {
  private readonly logger = new Logger(KeyResultGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT, core, core.keyResult)
  }

  @RequiredActions('key-result:read')
  @Query(() => KeyResultQueryResultGraphQLObject, { name: 'keyResults' })
  protected async getKeyResults(
    @Args() { first, ...filters }: KeyResultFiltersRequest,
    @GraphQLUser() graphqlUser: AuthorizationUser,
  ) {
    this.logger.log({
      first,
      filters,
      graphqlUser,
      message: 'Fetching key-results with filters',
    })

    const queryOptions: GetOptions<KeyResult> = {
      limit: first,
    }
    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      graphqlUser,
      queryOptions,
    )

    const response = this.marshalQueryResponse<KeyResultNodeGraphQLObject>(queryResult)

    return response
  }
}
