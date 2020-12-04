import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import { DomainKeyResultService } from 'domain/key-result'
import DomainObjectiveService from 'domain/objective/service'
import DomainTeamService from 'domain/team/service'
import DomainUserService from 'domain/user/service'

import { KeyResultObject } from './models'
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

    const keyResult = await this.resolverService.getOneByIDWithActionScopeConstraint(id, user)
    if (!keyResult) throw new NotFoundException(`We could not found a key result with id ${id}`)

    return keyResult
  }

  @ResolveField()
  async owner(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching owner for key result',
    })

    return this.userDomain.getOneByID(keyResult.ownerId)
  }

  @ResolveField()
  async objective(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching objective for key result',
    })

    return this.objectiveDomain.getOneByID(keyResult.objectiveId)
  }

  @ResolveField()
  async team(@Parent() keyResult: KeyResultObject) {
    this.logger.log({
      keyResult,
      message: 'Fetching team for key result',
    })

    return this.teamDomain.getOneByID(keyResult.teamId)
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
}

export default GraphQLKeyResultResolver
