import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { ACTION, PERMISSION } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainCompanyService from 'domain/company/service'
import DomainKeyResultService from 'domain/key-result/service'
import { DomainUserService } from 'domain/user'

import { TeamObject } from './models'
import GraphQLTeamService from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => TeamObject)
class GraphQLTeamResolver {
  private readonly logger = new Logger(GraphQLTeamResolver.name)

  constructor(
    private readonly resolverService: GraphQLTeamService,
    private readonly keyResultDomain: DomainKeyResultService,
    private readonly companyDomain: DomainCompanyService,
    private readonly userDomain: DomainUserService,
  ) {}

  @Permissions(PERMISSION['TEAM:READ'])
  @Query(() => TeamObject)
  async team(@Args('id', { type: () => ID }) id: TeamObject['id'], @GraphQLUser() user: AuthzUser) {
    this.logger.log(`Fetching team with id ${id.toString()}`)

    const team = await this.resolverService.getOneByIDWithActionScopeConstraint(
      id,
      user,
      ACTION.READ,
    )
    if (!team) throw new NotFoundException(`We could not found a team with id ${id}`)

    return team
  }

  @ResolveField()
  async keyResults(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching key results for team',
    })

    return this.keyResultDomain.getFromTeam(team.id)
  }

  @ResolveField()
  async company(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching company for team',
    })

    return this.companyDomain.getOneByID(team.companyId)
  }

  @ResolveField()
  async owner(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching owner for team',
    })

    return this.userDomain.getOneByID(team.ownerId)
  }
}

export default GraphQLTeamResolver
