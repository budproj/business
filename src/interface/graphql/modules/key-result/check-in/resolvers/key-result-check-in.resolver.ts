import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedMutation } from '@interface/graphql/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/objects/key-result/check-in/key-result-check-in.node'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { KeyResultCheckInCreateRequest } from '../requests/key-result-check-in-create.request'

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
    @Args() request: NodeIndexesRequest,
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

  @GuardedMutation(KeyResultCheckInGraphQLNode, 'key-result-check-in:create', {
    name: 'createKeyResultCheckIn',
  })
  protected async createKeyResultCheckIn(
    @Args() request: KeyResultCheckInCreateRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      authorizationUser,
      request,
      message: 'Received create check-in request',
    })

    const isKeyResultActive = await this.core.keyResult.isActiveFromIndexes({
      id: request.data.keyResultId,
    })
    if (!isKeyResultActive)
      throw new UserInputError(
        'You cannot create this check-in, because that cycle is not active anymore',
      )

    const checkIn = await this.core.keyResult.buildCheckInForUser(authorizationUser, request.data)
    const createdCheckIns = await this.queryGuard.createWithActionScopeConstraint(
      checkIn,
      authorizationUser,
    )

    this.logger.log({
      authorizationUser,
      checkIn,
      message: 'Creating a new check-in in our database',
    })

    if (!createdCheckIns || createdCheckIns.length === 0)
      throw new UserInputError('We were not able to create your check-in')

    const createdCheckIn = createdCheckIns[0]

    return createdCheckIn
  }
}
