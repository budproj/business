import { Logger, NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, PermissionsGuard } from 'app/authz/guards'
import CompanyService from 'domain/company/service'
import KeyResultService from 'domain/key-result/service'
import { TeamDTO } from 'domain/team/dto'
import TeamService from 'domain/team/service'

import { Team } from './models'

@UseGuards(GraphQLAuthGuard, PermissionsGuard)
@Resolver(() => Team)
class TeamResolver {
  private readonly logger = new Logger(TeamResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly teamService: TeamService,
    private readonly companyService: CompanyService,
  ) {}

  @Permissions('read:teams')
  @Query(() => Team)
  async team(@Args('id', { type: () => Int }) id: TeamDTO['id']) {
    this.logger.log(`Fetching team with id ${id.toString()}`)

    const team = await this.teamService.getOneById(id)
    if (!team) throw new NotFoundException(`Sorry, we could not found a team with id ${id}`)

    return team
  }

  @ResolveField()
  async keyResults(@Parent() team: TeamDTO) {
    this.logger.log({
      team,
      message: 'Fetching key results for team',
    })

    return this.keyResultService.getFromTeam(team.id)
  }

  @ResolveField()
  async company(@Parent() team: TeamDTO) {
    this.logger.log({
      team,
      message: 'Fetching company for team',
    })

    return this.companyService.getOneById(team.companyId)
  }
}

export default TeamResolver
