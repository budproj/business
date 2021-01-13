import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION } from 'src/app/authz/constants'
import { GraphQLUser, Permissions } from 'src/app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'src/app/authz/guards'
import { EnhanceWithBudUser } from 'src/app/authz/interceptors'
import { AuthzUser } from 'src/app/authz/types'
import DomainKeyResultService from 'src/domain/key-result/service'
import DomainObjectiveService from 'src/domain/objective/service'
import DomainTeamService from 'src/domain/team/service'
import DomainUserService from 'src/domain/user/service'

import { KeyResultInput, KeyResultObject } from './models'
import GraphQLKeyResultService from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultObject)
class GraphQLKeyResultResolver {
  private readonly logger = new Logger(GraphQLKeyResultResolver.name)

  constructor(
    private readonly resolverService: GraphQLKeyResultService,
    private readonly keyResultDomain: DomainKeyResultService,
    private readonly userDomain: DomainUserService,
    private readonly objectiveDomain: DomainObjectiveService,
    private readonly teamDomain: DomainTeamService,
  ) {}

  @Permissions(PERMISSION['KEY_RESULT:READ'])
  @Query(() => KeyResultObject)
  async keyResult(
    @Args('id', { type: () => ID }) id: KeyResultObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching key result with id ${id.toString()}`)

    const keyResult = await this.resolverService.getOneWithActionScopeConstraint({ id }, user)
    if (!keyResult) throw new NotFoundException(`We could not found a key result with id ${id}`)

    return keyResult
  }

  @ResolveField()
  async owner(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching owner for key result',
    })

    return this.userDomain.getOne({ id: keyResult.ownerId })
  }

  @ResolveField()
  async objective(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching objective for key result',
    })

    return this.objectiveDomain.getOne({ id: keyResult.objectiveId })
  }

  @ResolveField()
  async team(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching team for key result',
    })

    return this.teamDomain.getOne({ id: keyResult.teamId })
  }

  @ResolveField()
  async progressReports(
    @Parent() keyResult: KeyResultObject,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    this.logger.log({
      keyResult,
      limit,
      message: 'Fetching progress reports for key result',
    })

    return this.keyResultDomain.report.progress.getFromKeyResult(keyResult.id, {
      limit,
    })
  }

  @ResolveField()
  async confidenceReports(
    @Parent() keyResult: KeyResultObject,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    this.logger.log({
      keyResult,
      limit,
      message: 'Fetching confidence reports for key result',
    })

    return this.keyResultDomain.report.confidence.getFromKeyResult(keyResult.id, {
      limit,
    })
  }

  @ResolveField()
  async policies(@Parent() keyResult: KeyResultObject, @GraphQLUser() user: AuthzUser) {
    this.logger.log({
      keyResult,
      user,
      message: 'Deciding policies for user regarding key result',
    })
    const selector = { id: keyResult.id }

    return this.resolverService.getUserPolicies(selector, user)
  }

  @Permissions(PERMISSION['KEY_RESULT:UPDATE'])
  @Mutation(() => KeyResultObject)
  async updateKeyResult(
    @Args('id', { type: () => ID }) id: KeyResultObject['id'],
    @Args('keyResultInput', { type: () => KeyResultInput })
    keyResultInput: KeyResultInput,
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log({
      keyResultInput,
      message: `Updating key result of id ${id}`,
    })

    const updatedKeyResult = await this.resolverService.updateWithScopeConstraint(
      { id },
      keyResultInput,
      user,
    )
    if (!updatedKeyResult)
      throw new NotFoundException(`We could not found a key result for id ${id}`)

    return updatedKeyResult
  }

  @ResolveField()
  async currentProgress(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching current progress for key result',
    })

    return this.keyResultDomain.getCurrentProgress(keyResult.id)
  }

  @ResolveField()
  async currentConfidence(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching current confidence for key result',
    })

    return this.keyResultDomain.getCurrentConfidence(keyResult.id)
  }
}

export default GraphQLKeyResultResolver
