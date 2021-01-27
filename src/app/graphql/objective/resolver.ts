import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Float, ID, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import { CycleObject } from 'src/app/graphql/cycle/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { UserObject } from 'src/app/graphql/user'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { Objective } from 'src/domain/objective/entities'
import DomainService from 'src/domain/service'

import { ObjectiveObject } from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => ObjectiveObject)
class GraphQLObjectiveResolver extends GraphQLEntityResolver<Objective, ObjectiveDTO> {
  private readonly logger = new Logger(GraphQLObjectiveResolver.name)

  constructor(protected readonly domain: DomainService) {
    super(RESOURCE.OBJECTIVE, domain, domain.objective)
  }

  @Permissions(PERMISSION['OBJECTIVE:READ'])
  @Query(() => ObjectiveObject, { name: 'objective' })
  protected async getObjective(
    @Args('id', { type: () => ID }) id: ObjectiveObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching objective with id ${id.toString()}`)

    const objective = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!objective) throw new NotFoundException(`We could not found an objective with id ${id}`)

    return objective
  }

  @ResolveField('owner', () => UserObject)
  protected async getObjectiveOwner(@Parent() objective: ObjectiveObject) {
    this.logger.log({
      objective,
      message: 'Fetching owner for objective',
    })

    return this.domain.user.getOne({ id: objective.ownerId })
  }

  @ResolveField('cycle', () => CycleObject)
  protected async getObjectiveCycle(@Parent() objective: ObjectiveObject) {
    this.logger.log({
      objective,
      message: 'Fetching cycle for objective',
    })

    return this.domain.cycle.getOne({ id: objective.cycleId })
  }

  @ResolveField('keyResults', () => [KeyResultObject], { nullable: true })
  protected async getObjectiveKeyResults(@Parent() objective: ObjectiveObject) {
    this.logger.log({
      objective,
      message: 'Fetching key results for objective',
    })

    return this.domain.keyResult.getFromObjective(objective)
  }

  @ResolveField('currentProgress', () => Float)
  protected async getObjectiveCurrentProgress(@Parent() objective: ObjectiveObject) {
    this.logger.log({
      objective,
      message: 'Fetching current progress for objective',
    })

    return this.domain.objective.getCurrentProgressForObjective(objective)
  }

  @ResolveField('currentConfidence', () => Int)
  protected async getObjectiveCurrentConfidence(@Parent() objective: ObjectiveObject) {
    this.logger.log({
      objective,
      message: 'Fetching current confidence for objective',
    })

    return this.domain.objective.getCurrentConfidenceForObjective(objective)
  }
  //
  // @ResolveField()
  // async percentageProgressIncrease(@Parent() objective: ObjectiveObject) {
  //   this.logger.log({
  //     objective,
  //     message: 'Fetching percentage progress increase',
  //   })
  //
  //   return this.objectiveDomain.getPercentageProgressIncrease(objective.id)
  // }
}

export default GraphQLObjectiveResolver
