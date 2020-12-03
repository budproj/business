import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainCompanyService from 'domain/company/service'
import DomainKeyResultService from 'domain/key-result/service'
import DomainTeamService from 'domain/team/service'

import { TeamObject } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => TeamObject)
class GraphQLTeamResolver {
  private readonly logger = new Logger(GraphQLTeamResolver.name)

  constructor(
    private readonly keyResultService: DomainKeyResultService,
    private readonly teamService: DomainTeamService,
    private readonly companyService: DomainCompanyService,
  ) {}

  @Permissions('read:teams')
  @Query(() => TeamObject)
  async team(@Args('id', { type: () => ID }) id: TeamObject['id'], @GraphQLUser() user: AuthzUser) {
    this.logger.log(`Fetching team with id ${id.toString()}`)

    const team = await this.teamService.getOneByIdIfUserShareCompany(id, user)
    if (!team) throw new NotFoundException(`We could not found a team with id ${id}`)

    return team
  }

  @ResolveField()
  async keyResults(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching key results for team',
    })

    return this.keyResultService.getFromTeam(team.id)
  }

  @ResolveField()
  async company(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching company for team',
    })

    return this.companyService.getOneById(team.companyId)
  }
}

export default GraphQLTeamResolver
