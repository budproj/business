import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import { PolicyObject } from 'src/app/graphql/authz/models'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { TeamObject } from 'src/app/graphql/team/models'
import { UserObject } from 'src/app/graphql/user'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResult } from 'src/domain/key-result/entities'
import DomainService from 'src/domain/service'

import { KeyResultObject } from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultObject)
class GraphQLKeyResultResolver extends GraphQLEntityResolver<KeyResult, KeyResultDTO> {
  private readonly logger = new Logger(GraphQLKeyResultResolver.name)

  constructor(protected readonly domain: DomainService) {
    super(RESOURCE.TEAM, domain, domain.keyResult)
  }

  @Permissions(PERMISSION['KEY_RESULT:READ'])
  @Query(() => KeyResultObject, { name: 'keyResult' })
  protected async getKeyResult(
    @Args('id', { type: () => ID }) id: KeyResultObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching key result with id ${id.toString()}`)

    const keyResult = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!keyResult) throw new NotFoundException(`We could not found a key result with id ${id}`)

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

  @ResolveField('policies', () => PolicyObject)
  protected async getKeyResultPolicies(
    @Parent() keyResult: KeyResultObject,
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log({
      keyResult,
      user,
      message: 'Deciding policies for user regarding key result',
    })
    const selector = { id: keyResult.id }

    return this.getUserPolicies(selector, user)
  }
  //
  //
  // @ResolveField()
  // async progressReports(
  //   @Parent() keyResult: KeyResultObject,
  //   @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  // ) {
  //   this.logger.log({
  //     keyResult,
  //     limit,
  //     message: 'Fetching progress reports for key result',
  //   })
  //
  //   return this.keyResultDomain.report.progress.getFromKeyResult(keyResult.id, {
  //     limit,
  //   })
  // }
  //
  // @ResolveField()
  // async confidenceReports(
  //   @Parent() keyResult: KeyResultObject,
  //   @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  // ) {
  //   this.logger.log({
  //     keyResult,
  //     limit,
  //     message: 'Fetching confidence reports for key result',
  //   })
  //
  //   return this.keyResultDomain.report.confidence.getFromKeyResult(keyResult.id, {
  //     limit,
  //   })
  // }
  //
  // @ResolveField()
  // async currentProgress(@Parent() keyResult: KeyResultObject) {
  //   this.logger.log({
  //     keyResult,
  //     message: 'Fetching current progress for key result',
  //   })
  //
  //   return this.keyResultDomain.getCurrentProgress(keyResult.id)
  // }
  //
  // @ResolveField()
  // async currentConfidence(@Parent() keyResult: KeyResultObject) {
  //   this.logger.log({
  //     keyResult,
  //     message: 'Fetching current confidence for key result',
  //   })
  //
  //   return this.keyResultDomain.getCurrentConfidence(keyResult.id)
  // }
  //
  // @ResolveField()
  // async reports(@Parent() keyResult: KeyResultObject) {
  //   this.logger.log({
  //     keyResult,
  //     message: 'Fetching reports for key result',
  //   })
  //
  //   return this.keyResultDomain.getReports(keyResult.id)
  // }
}

export default GraphQLKeyResultResolver
