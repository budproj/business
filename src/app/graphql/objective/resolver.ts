import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainCycleService from 'domain/cycle/service'
import DomainKeyResultService from 'domain/key-result/service'
import { DomainUserService } from 'domain/user'

import { ObjectiveObject } from './models'
import GraphQLObjectiveService from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => ObjectiveObject)
class GraphQLObjectiveResolver {
  private readonly logger = new Logger(GraphQLObjectiveResolver.name)

  constructor(
    private readonly resolverService: GraphQLObjectiveService,
    private readonly keyResultDomain: DomainKeyResultService,
    private readonly cycleDomain: DomainCycleService,
    private readonly userDomain: DomainUserService,
  ) {}

  @Permissions(PERMISSION['OBJECTIVE:READ'])
  @Query(() => ObjectiveObject)
  async objective(
    @Args('id', { type: () => ID }) id: ObjectiveObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching objective with id ${id.toString()}`)

    const objective = await this.resolverService.getOneByIDWithScopeConstraint(id, user)
    if (!objective) throw new NotFoundException(`We could not found an objective with id ${id}`)

    return objective
  }

  @ResolveField()
  async keyResults(@Parent() objective: ObjectiveObject) {
    this.logger.log({
      objective,
      message: 'Fetching key results for objective',
    })

    return this.keyResultDomain.getFromObjective(objective.id)
  }

  @ResolveField()
  async cycle(@Parent() objective: ObjectiveObject) {
    this.logger.log({
      objective,
      message: 'Fetching cycle for objective',
    })

    return this.cycleDomain.getOneByID(objective.cycleId)
  }

  @ResolveField()
  async owner(@Parent() objective: ObjectiveObject) {
    this.logger.log({
      objective,
      message: 'Fetching owner for objective',
    })

    return this.userDomain.getOneByID(objective.ownerId)
  }
}

export default GraphQLObjectiveResolver
