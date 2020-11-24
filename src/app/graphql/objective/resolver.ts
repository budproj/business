import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import CycleService from 'domain/cycle/service'
import KeyResultService from 'domain/key-result/service'
import { ObjectiveDTO } from 'domain/objective/dto'
import ObjectiveService from 'domain/objective/service'

import { Objective } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => Objective)
class ObjectiveResolver {
  private readonly logger = new Logger(ObjectiveResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly objectiveService: ObjectiveService,
    private readonly cycleService: CycleService,
  ) {}

  @Permissions('read:objectives')
  @Query(() => Objective)
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

export default ObjectiveResolver
