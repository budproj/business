import { Logger, NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, PermissionsGuard } from 'app/authz/guards'
import CompanyService from 'domain/company/service'
import { CycleDTO } from 'domain/cycle/dto'
import CycleService from 'domain/cycle/service'
import ObjectiveService from 'domain/objective/service'

import { Cycle } from './models'

@UseGuards(GraphQLAuthGuard, PermissionsGuard)
@Resolver(() => Cycle)
class CycleResolver {
  private readonly logger = new Logger(CycleResolver.name)

  constructor(
    private readonly cycleService: CycleService,
    private readonly companyService: CompanyService,
    private readonly objectiveService: ObjectiveService,
  ) {}

  @Permissions('read:cycles')
  @Query(() => Cycle)
  async cycle(@Args('id', { type: () => Int }) id: CycleDTO['id']) {
    this.logger.log(`Fetching cycle with id ${id.toString()}`)

    const cycle = await this.cycleService.getOneById(id)
    if (!cycle) throw new NotFoundException(`Sorry, we could not found a cycle with id ${id}`)

    return cycle
  }

  @ResolveField()
  async company(@Parent() cycle: CycleDTO) {
    this.logger.log({
      cycle,
      message: 'Fetching company for cycle',
    })

    return this.companyService.getOneById(cycle.companyId)
  }

  @ResolveField()
  async objectives(@Parent() cycle: CycleDTO) {
    this.logger.log({
      cycle,
      message: 'Fetching objectives for cycle',
    })

    return this.objectiveService.getFromCycle(cycle.id)
  }
}

export default CycleResolver
