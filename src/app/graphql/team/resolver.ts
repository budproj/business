import { Logger, UseGuards } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, PermissionsGuard } from 'app/authz/guards'
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
  ) {}

  @Permissions('read:teams')
  @Query(() => Team)
  async team(@Args('id', { type: () => Int }) id: TeamDTO['id']) {
    this.logger.log(`Fetching team with id ${id.toString()}`)

    return this.teamService.getOneById(id)
  }

  @ResolveField()
  async keyResults(@Parent() team: Team) {
    this.logger.log({
      team,
      message: 'Fetching key results for team',
    })

    return this.keyResultService.getFromTeam(team.id)
  }
}

export default TeamResolver
