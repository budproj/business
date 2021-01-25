import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION } from 'src/app/authz/constants'
import { GraphQLUser, Permissions } from 'src/app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'src/app/authz/guards'
import { EnhanceWithBudUser } from 'src/app/authz/interceptors'
import { AuthzUser } from 'src/app/authz/types'
import DomainObjectiveService from 'src/domain/objective/service'
import DomainTeamService from 'src/domain/team/service'

import { CycleObject } from './models'
import GraphQLCycleService from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => CycleObject)
class GraphQLCycleResolver {
  private readonly logger = new Logger(GraphQLCycleResolver.name)

  constructor(
    private readonly resolverService: GraphQLCycleService,
    private readonly teamDomain: DomainTeamService,
    private readonly objectiveDomain: DomainObjectiveService,
  ) {}

  @Permissions(PERMISSION['CYCLE:READ'])
  @Query(() => CycleObject)
  async cycle(
    @Args('id', { type: () => ID }) id: CycleObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching cycle with id ${id.toString()}`)

    const cycle = await this.resolverService.getOneWithActionScopeConstraint({ id }, user)
    if (!cycle) throw new NotFoundException(`We could not found a cycle with id ${id}`)

    return cycle
  }

  @ResolveField()
  async team(@Parent() cycle: CycleObject) {
    this.logger.log({
      cycle,
      message: 'Fetching team for cycle',
    })

    return this.teamDomain.getOne({ id: cycle.teamId })
  }

  @ResolveField()
  async objectives(@Parent() cycle: CycleObject) {
    this.logger.log({
      cycle,
      message: 'Fetching objectives for cycle',
    })

    return this.objectiveDomain.getFromCycle(cycle.id)
  }
}

export default GraphQLCycleResolver
