import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { TeamObject } from 'src/app/graphql/team/models'
import { CycleDTO } from 'src/domain/cycle/dto'
import { Cycle } from 'src/domain/cycle/entities'
import DomainService from 'src/domain/service'

import { CycleObject } from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => CycleObject)
class GraphQLCycleResolver extends GraphQLEntityResolver<Cycle, CycleDTO> {
  private readonly logger = new Logger(GraphQLCycleResolver.name)

  constructor(protected readonly domain: DomainService) {
    super(RESOURCE.CYCLE, domain, domain.cycle)
  }

  @Permissions(PERMISSION['CYCLE:READ'])
  @Query(() => CycleObject, { name: 'cycle' })
  protected async getCycle(
    @Args('id', { type: () => ID }) id: CycleObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching cycle with id ${id.toString()}`)

    const cycle = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!cycle) throw new NotFoundException(`We could not found a cycle with id ${id}`)

    return cycle
  }

  @ResolveField('team', () => TeamObject)
  protected async getCycleTeam(@Parent() cycle: CycleObject) {
    this.logger.log({
      cycle,
      message: 'Fetching team for cycle',
    })

    return this.domain.team.getOne({ id: cycle.teamId })
  }

  @ResolveField('objectives', () => [ObjectiveObject], { nullable: true })
  protected async getCycleObjectives(@Parent() cycle: CycleObject) {
    this.logger.log({
      cycle,
      message: 'Fetching objectives for cycle',
    })

    return this.domain.objective.getFromCycle(cycle)
  }
}

export default GraphQLCycleResolver
