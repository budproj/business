import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Float, ID, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import AuthzService from 'src/app/authz/service'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import { KeyResultCommentObject } from 'src/app/graphql/key-result/comment/models'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { TeamObject } from 'src/app/graphql/team/models'
import { UserObject } from 'src/app/graphql/user'
import { DOMAIN_QUERY_ORDER } from 'src/domain/constants'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResult } from 'src/domain/key-result/entities'
import DomainService from 'src/domain/service'

import { KeyResultCheckInObject } from './check-in/models'
import { KeyResultObject } from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultObject)
class GraphQLKeyResultResolver extends GraphQLEntityResolver<KeyResult, KeyResultDTO> {
  private readonly logger = new Logger(GraphQLKeyResultResolver.name)

  constructor(
    protected readonly domain: DomainService,
    protected readonly authzService: AuthzService,
  ) {
    super(RESOURCE.KEY_RESULT, domain, domain.keyResult, authzService)
  }

  @Permissions(PERMISSION['KEY_RESULT:READ'])
  @Query(() => KeyResultObject, { name: 'keyResult' })
  protected async getKeyResult(
    @Args('id', { type: () => ID }) id: KeyResultObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching key result with id ${id}`)

    const keyResult = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!keyResult) throw new UserInputError(`We could not found a key result with id ${id}`)

    return keyResult
  }

  @ResolveField('owner', () => UserObject)
  protected async getKeyResultOwner(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching owner for key result',
    })

    return this.domain.user.getOne({ id: keyResult.ownerId })
  }

  @ResolveField('team', () => TeamObject)
  protected async getKeyResultTeam(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching team for key result',
    })

    return this.domain.team.getOne({ id: keyResult.teamId })
  }

  @ResolveField('objective', () => ObjectiveObject)
  protected async getKeyResultObjective(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching objective for key result',
    })

    return this.domain.objective.getOne({ id: keyResult.objectiveId })
  }

  @ResolveField('keyResultCheckIns', () => [KeyResultCheckInObject], { nullable: true })
  protected async getKeyResultCheckIns(
    @Parent() keyResult: KeyResultObject,
    @Args('order', { type: () => DOMAIN_QUERY_ORDER, defaultValue: DOMAIN_QUERY_ORDER.DESC })
    order: DOMAIN_QUERY_ORDER,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    this.logger.log({
      keyResult,
      limit,
      order,
      message: 'Fetching check-ins for key result',
    })

    const options = {
      limit,
      orderBy: {
        createdAt: order,
      },
    }

    return this.domain.keyResult.getCheckIns(keyResult, options)
  }

  @ResolveField('currentProgress', () => Float)
  protected async getKeyResultCurrentProgress(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching current progress for key result',
    })

    return this.domain.keyResult.getCurrentProgressForKeyResult(keyResult)
  }

  @ResolveField('currentConfidence', () => Float)
  protected async getKeyResultCurrentConfidence(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching current confidence for key result',
    })

    return this.domain.keyResult.getCurrentConfidenceForKeyResult(keyResult)
  }

  @ResolveField('keyResultComments', () => [KeyResultCommentObject])
  protected async getKeyResultComments(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching comments for key result',
    })

    return this.domain.keyResult.getComments(keyResult)
  }
}

export default GraphQLKeyResultResolver
