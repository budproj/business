import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { KeyResultInterface } from '@core/modules/key-result/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { PolicyGraphQLObject } from '../objects/authorization/policy.object'
import { KeyResultCommentNodeGraphQLObject } from '../objects/key-result/comment/key-result-comment-node.object'
import { KeyResultNodeGraphQLObject } from '../objects/key-result/key-result-node.object'
import { KeyResultQueryResultGraphQLObject } from '../objects/key-result/key-result-query.object'
import { ObjectiveNodeGraphQLObject } from '../objects/objetive/objective-node.object'
import { TeamNodeGraphQLObject } from '../objects/team/team-node.object'
import { UserNodeGraphQLObject } from '../objects/user/user-node.object'
import { KeyResultFiltersRequest } from '../requests/key-result/key-result.request'

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

  @ResolveField('owner', () => UserNodeGraphQLObject)
  protected async getKeyResultOwner(@Parent() keyResult: KeyResultNodeGraphQLObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching owner for key result',
    })

    return this.core.user.getOne({ id: keyResult.ownerId })
  }

  @ResolveField('team', () => TeamNodeGraphQLObject)
  protected async getKeyResultTeam(@Parent() keyResult: KeyResultNodeGraphQLObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching team for key result',
    })

    const team = await this.core.team.getOne({ id: keyResult.teamId })

    return team
  }

  @ResolveField('objective', () => ObjectiveNodeGraphQLObject)
  protected async getKeyResultNodeGraphQLObjective(
    @Parent() keyResult: KeyResultNodeGraphQLObject,
  ) {
    this.logger.log({
      keyResult,
      message: 'Fetching objective for key result',
    })

    return this.core.objective.getFromKeyResult(keyResult)
  }

  @ResolveField('keyResultComments', () => [KeyResultCommentNodeGraphQLObject])
  protected async getKeyResultComments(@Parent() keyResult: KeyResultNodeGraphQLObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching comments for key result',
    })

    return this.core.keyResult.getComments(keyResult)
  }

  protected async customizeEntityPolicy(originalPolicy: PolicyGraphQLObject, keyResult: KeyResult) {
    const restrictedToActivePolicy = await this.restrictPolicyToActiveKeyResult(
      originalPolicy,
      keyResult,
    )

    return restrictedToActivePolicy
  }

  private async restrictPolicyToActiveKeyResult(
    originalPolicy: PolicyGraphQLObject,
    keyResult: KeyResult,
  ) {
    if (this.policy.commandStatementIsDenyingAll(originalPolicy)) return originalPolicy

    const objective = await this.core.objective.getFromKeyResult(keyResult)
    const cycle = await this.core.cycle.getFromObjective(objective)

    return cycle.active ? originalPolicy : this.policy.denyCommandStatement(originalPolicy)
  }
}
