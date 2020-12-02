import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import { KeyResultDTO } from 'domain/key-result/dto'
import DomainKeyResultService from 'domain/key-result/service'
import DomainObjectiveService from 'domain/objective/service'
import DomainTeamService from 'domain/team/service'
import DomainUserService from 'domain/user/service'

import { KeyResultObject } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultObject)
class GraphQLKeyResultResolver {
  private readonly logger = new Logger(GraphQLKeyResultResolver.name)

  constructor(
    private readonly keyResultService: DomainKeyResultService,
    private readonly userService: DomainUserService,
    private readonly objectiveService: DomainObjectiveService,
    private readonly teamService: DomainTeamService,
  ) {}

  @Permissions('read:key-results')
  @Query(() => KeyResultObject)
  async keyResult(
    @Args('id', { type: () => Int }) id: KeyResultDTO['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching key result with id ${id.toString()}`)

    const keyResult = await this.keyResultService.getOneByIdIfUserIsInCompany(id, user)
    if (!keyResult) throw new NotFoundException(`We could not found a key result with id ${id}`)

    return keyResult
  }

  @ResolveField()
  async owner(@Parent() keyResult: KeyResultDTO) {
    this.logger.log({
      keyResult,
      message: 'Fetching owner for key result',
    })

    return this.userService.getOneById(keyResult.ownerId)
  }

  @ResolveField()
  async objective(@Parent() keyResult: KeyResultDTO) {
    this.logger.log({
      keyResult,
      message: 'Fetching objective for key result',
    })

    return this.objectiveService.getOneById(keyResult.objectiveId)
  }

  @ResolveField()
  async team(@Parent() keyResult: KeyResultDTO) {
    this.logger.log({
      keyResult,
      message: 'Fetching team for key result',
    })

    return this.teamService.getOneById(keyResult.teamId)
  }

  @ResolveField()
  async progressReports(
    @Parent() keyResult: KeyResultDTO,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    this.logger.log({
      keyResult,
      limit,
      message: 'Fetching progress reports for key result',
    })

    return this.keyResultService.report.progress.getFromKeyResult(keyResult.id, {
      limit,
    })
  }

  @ResolveField()
  async confidenceReports(
    @Parent() keyResult: KeyResultDTO,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    this.logger.log({
      keyResult,
      limit,
      message: 'Fetching confidence reports for key result',
    })

    return this.keyResultService.report.confidence.getFromKeyResult(keyResult.id, {
      limit,
    })
  }
}

export default GraphQLKeyResultResolver
