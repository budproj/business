import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Float, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import AuthzService from 'src/app/authz/service'
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

import { ObjectiveObject, ObjectiveStatusObject } from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => ObjectiveObject)
class GraphQLObjectiveResolver extends GraphQLEntityResolver<Objective, ObjectiveDTO> {
  private readonly logger = new Logger(GraphQLObjectiveResolver.name)

  constructor(
    protected readonly domain: DomainService,
    protected readonly authzService: AuthzService,
  ) {
    super(RESOURCE.OBJECTIVE, domain, domain.objective, authzService)
  }

  @Permissions(PERMISSION['OBJECTIVE:READ'])
  @Query(() => ObjectiveObject, { name: 'objective' })
  protected async getObjective(
    @Args('id', { type: () => ID }) id: ObjectiveObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching objective with id ${id}`)

    const objective = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!objective) throw new UserInputError(`We could not found an objective with id ${id}`)

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

    return this.domain.cycle.getFromObjective(objective)
  }

  @ResolveField('keyResults', () => [KeyResultObject], { nullable: true })
  protected async getObjectiveKeyResults(@Parent() objective: ObjectiveObject) {
    this.logger.log({
      objective,
      message: 'Fetching key results for objective',
    })

    return this.domain.keyResult.getFromObjective(objective)
  }

  @ResolveField('status', () => ObjectiveStatusObject)
  protected async getObjectiveStatus(@Parent() objective: ObjectiveObject) {
    this.logger.log({
      objective,
      message: 'Fetching current status for objective',
    })

    return this.domain.objective.getCurrentStatus(objective)
  }

  @ResolveField('progressIncreaseSinceLastWeek', () => Float)
  protected async getObjectiveProgressIncreaseSinceLastWeek(@Parent() objective: ObjectiveObject) {
    this.logger.log({
      objective,
      message: 'Fetching progress increase for objective since last week',
    })

    return this.domain.objective.getObjectiveProgressIncreaseSinceLastWeek(objective)
  }
}

export default GraphQLObjectiveResolver
