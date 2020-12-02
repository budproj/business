import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainCompanyService from 'domain/company/service'
import DomainCycleService from 'domain/cycle/service'
import DomainObjectiveService from 'domain/objective/service'

import { CycleObject } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => CycleObject)
class GraphQLCycleResolver {
  private readonly logger = new Logger(GraphQLCycleResolver.name)

  constructor(
    private readonly cycleService: DomainCycleService,
    private readonly companyService: DomainCompanyService,
    private readonly objectiveService: DomainObjectiveService,
  ) {}

  @Permissions('read:cycles')
  @Query(() => CycleObject)
  async cycle(
    @Args('id', { type: () => Int }) id: CycleObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching cycle with id ${id.toString()}`)

    const cycle = await this.cycleService.getOneByIdIfUserIsInCompany(id, user)
    if (!cycle) throw new NotFoundException(`We could not found a cycle with id ${id}`)

    return cycle
  }

  @ResolveField()
  async company(@Parent() cycle: CycleObject) {
    this.logger.log({
      cycle,
      message: 'Fetching company for cycle',
    })

    return this.companyService.getOneById(cycle.companyId)
  }

  @ResolveField()
  async objectives(@Parent() cycle: CycleObject) {
    this.logger.log({
      cycle,
      message: 'Fetching objectives for cycle',
    })

    return this.objectiveService.getFromCycle(cycle.id)
  }
}

export default GraphQLCycleResolver
