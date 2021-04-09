import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { KeyResultCommentInterface } from '@core/modules/key-result/comment/key-result-comment.interface'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'

import { PolicyGraphQLObject } from '../objects/authorization/policy.object'
import { KeyResultCommentNodeGraphQLObject } from '../objects/key-result/comment/key-result-comment-node.object'
import { KeyResultCommentQueryResultGraphQLObject } from '../objects/key-result/comment/key-result-comment-query.object'
import { KeyResultNodeGraphQLObject } from '../objects/key-result/key-result-node.object'
import { UserNodeGraphQLObject } from '../objects/user/user-node.object'
import { KeyResultCommentFiltersRequest } from '../requests/key-result/comment/key-result-comment.request'

import { BaseGraphQLResolver } from './base.resolver'
import { GraphQLUser } from './decorators/graphql-user'
import { GraphQLRequiredPoliciesGuard } from './guards/required-policies.guard'
import { GraphQLTokenGuard } from './guards/token.guard'
import { NourishUserDataInterceptor } from './interceptors/nourish-user-data.interceptor'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => KeyResultCommentNodeGraphQLObject)
export class KeyResultCommentGraphQLResolver extends BaseGraphQLResolver<
  KeyResultComment,
  KeyResultCommentInterface
> {
  private readonly logger = new Logger(KeyResultCommentGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT_COMMENT, core, core.keyResult.keyResultCommentProvider)
  }

  @RequiredActions('key-result-comment:read')
  @Query(() => KeyResultCommentQueryResultGraphQLObject, { name: 'keyResultComments' })
  protected async getKeyResultComments(
    @Args() { first, ...filters }: KeyResultCommentFiltersRequest,
    @GraphQLUser() graphqlUser: AuthorizationUser,
  ) {
    this.logger.log({
      first,
      filters,
      graphqlUser,
      message: 'Fetching key-result comments with filters',
    })

    const queryOptions: GetOptions<KeyResultComment> = {
      limit: first,
    }
    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      graphqlUser,
      queryOptions,
    )

    const response = this.marshalQueryResponse<KeyResultCommentNodeGraphQLObject>(queryResult)

    return response
  }

  @ResolveField('user', () => UserNodeGraphQLObject)
  protected async getKeyResultCommentUser(@Parent() comment: KeyResultCommentNodeGraphQLObject) {
    this.logger.log({
      comment,
      message: 'Fetching user for key result comment',
    })

    return this.core.user.getOne({ id: comment.userId })
  }

  @ResolveField('keyResult', () => KeyResultNodeGraphQLObject)
  protected async getKeyResultCommentKeyResult(
    @Parent() comment: KeyResultCommentNodeGraphQLObject,
  ) {
    this.logger.log({
      comment,
      message: 'Fetching key result for key result comment',
    })

    return this.core.keyResult.getOne({ id: comment.keyResultId })
  }

  protected async customizeEntityPolicy(
    originalPolicy: PolicyGraphQLObject,
    keyResultComment: KeyResultComment,
  ) {
    const restrictedToActivePolicy = await this.restrictPolicyToActiveKeyResult(
      originalPolicy,
      keyResultComment,
    )

    return restrictedToActivePolicy
  }

  private async restrictPolicyToActiveKeyResult(
    originalPolicy: PolicyGraphQLObject,
    keyResultComment: KeyResultComment,
  ) {
    if (this.policy.commandStatementIsDenyingAll(originalPolicy)) return originalPolicy

    const keyResult = await this.core.keyResult.getOne({ id: keyResultComment.keyResultId })
    const objective = await this.core.objective.getFromKeyResult(keyResult)
    const cycle = await this.core.cycle.getFromObjective(objective)

    return cycle.active ? originalPolicy : this.policy.denyCommandStatement(originalPolicy)
  }
}
