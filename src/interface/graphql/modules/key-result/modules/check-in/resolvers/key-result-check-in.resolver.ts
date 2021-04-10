import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckInInterface } from '@core/modules/key-result/modules/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/modules/check-in/key-result-check-in.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user'
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/objects/key-result/check-in/key-result-check-in.node'
import { NourishUserDataInterceptor } from '@interface/graphql/resolvers/interceptors/nourish-user-data.interceptor'

import { KeyResultCheckInIndexRequest } from '../requests/key-result-check-in-index.request'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => KeyResultCheckInGraphQLNode)
export class KeyResultCheckInGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResultCheckIn,
  KeyResultCheckInInterface
> {
  private readonly logger = new Logger(KeyResultCheckInGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT_CHECK_IN, core, core.keyResult.keyResultCheckInProvider)
  }

  @RequiredActions('key-result-check-in:read')
  @Query(() => KeyResultCheckInGraphQLNode, { name: 'keyResultCheckIn' })
  protected async getCheckIn(
    @Args() request: KeyResultCheckInIndexRequest,
    @AuthorizedRequestUser() authorizedRequestUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      message: 'Fetching key result check-in with provided indexes',
    })

    const checkIn = await this.queryGuard.getOneWithActionScopeConstraint(
      request,
      authorizedRequestUser,
    )
    if (!checkIn)
      throw new UserInputError(`We could not found a check-in with the provided arguments`)

    return checkIn
  }
}
