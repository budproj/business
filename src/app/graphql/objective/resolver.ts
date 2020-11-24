import { Logger, NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, PermissionsGuard } from 'app/authz/guards'
import KeyResultService from 'domain/key-result/service'
import { ObjectiveDTO } from 'domain/objective/dto'
import ObjectiveService from 'domain/objective/service'

import { Objective } from './models'

@UseGuards(GraphQLAuthGuard, PermissionsGuard)
@Resolver(() => Objective)
class ObjectiveResolver {
  private readonly logger = new Logger(ObjectiveResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly objectiveService: ObjectiveService,
  ) {}

  @Permissions('read:objectives')
  @Query(() => Objective)
  async objective(@Args('id', { type: () => Int }) id: ObjectiveDTO['id']) {
    this.logger.log(`Fetching objective with id ${id.toString()}`)

    const objective = await this.objectiveService.getOneById(id)
    if (!objective)
      throw new NotFoundException(`Sorry, we could not found an objective with id ${id}`)

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
}

export default ObjectiveResolver
