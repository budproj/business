import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainCompanyService from 'domain/company/service'
import DomainObjectiveService from 'domain/objective/service'

import { CycleObject } from './models'
import GraphQLCycleService from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => CycleObject)
class GraphQLCycleResolver {
  private readonly logger = new Logger(GraphQLCycleResolver.name)

  constructor(
    private readonly resolverService: GraphQLCycleService,
    private readonly companyDomain: DomainCompanyService,
    private readonly objectiveDomain: DomainObjectiveService,
  ) {}

  @Permissions(PERMISSION['CYCLE:READ'])
  @Query(() => CycleObject)
  async cycle(
    @Args('id', { type: () => ID }) id: CycleObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching cycle with id ${id.toString()}`)

    const cycle = await this.resolverService.getOneByIDWithActionScopeConstraint(id, user)
    if (!cycle) throw new NotFoundException(`We could not found a cycle with id ${id}`)

    return cycle
  }

  @ResolveField()
  async company(@Parent() cycle: CycleObject) {
    this.logger.log({
      cycle,
      message: 'Fetching company for cycle',
    })

    return this.companyDomain.getOneByID(cycle.companyId)
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
