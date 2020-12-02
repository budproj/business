import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainCycleService from 'domain/cycle/service'
import DomainKeyResultService from 'domain/key-result/service'
import { ObjectiveDTO } from 'domain/objective/dto'
import DomainObjectiveService from 'domain/objective/service'

import { ObjectiveObject } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => ObjectiveObject)
class GraphQLObjectiveResolver {
  private readonly logger = new Logger(GraphQLObjectiveResolver.name)

  constructor(
    private readonly keyResultService: DomainKeyResultService,
    private readonly objectiveService: DomainObjectiveService,
    private readonly cycleService: DomainCycleService,
  ) {}

  @Permissions('read:objectives')
  @Query(() => ObjectiveObject)
  async objective(
    @Args('id', { type: () => Int }) id: ObjectiveDTO['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching objective with id ${id.toString()}`)

    const objective = await this.objectiveService.getOneByIdIfUserIsInCompany(id, user)
    if (!objective) throw new NotFoundException(`We could not found an objective with id ${id}`)

    return objective
  }

  @ResolveField()
  async keyResults(@Parent() objective: ObjectiveDTO) {
    this.logger.log({
      objective,
      message: 'Fetching key results for objective',
    })

    return this.keyResultService.getFromObjective(objective.id)
  }

  @ResolveField()
  async cycle(@Parent() objective: ObjectiveDTO) {
    this.logger.log({
      objective,
      message: 'Fetching cycke for objective',
    })

    return this.cycleService.getOneById(objective.cycleId)
  }
}

export default GraphQLObjectiveResolver
