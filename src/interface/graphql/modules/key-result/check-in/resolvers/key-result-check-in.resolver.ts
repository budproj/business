import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckInInterface } from '@core/modules/key-result/modules/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/modules/check-in/key-result-check-in.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/objects/key-result/check-in/key-result-check-in.node'

import { KeyResultCheckInIndexRequest } from '../requests/key-result-check-in-index.request'

@GuardedResolver(KeyResultCheckInGraphQLNode)
export class KeyResultCheckInGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResultCheckIn,
  KeyResultCheckInInterface
> {
  private readonly logger = new Logger(KeyResultCheckInGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT_CHECK_IN, core, core.keyResult.keyResultCheckInProvider)
  }

  @GuardedQuery(KeyResultCheckInGraphQLNode, 'key-result-check-in:read', {
    name: 'keyResultCheckIn',
  })
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
