import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainCompanyService from 'domain/company/service'
import DomainKeyResultService from 'domain/key-result/service'
import DomainObjectiveService from 'domain/objective/service'
import DomainTeamService from 'domain/team/service'

import { UserObject } from './models'
import GraphQLUserService from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => UserObject)
class GraphQLUserResolver {
  private readonly logger = new Logger(GraphQLUserResolver.name)

  constructor(
    private readonly resolverService: GraphQLUserService,
    private readonly keyResultDomain: DomainKeyResultService,
    private readonly objectiveDomain: DomainObjectiveService,
    private readonly teamDomain: DomainTeamService,
    private readonly companyDomain: DomainCompanyService,
  ) {}

  @Permissions(PERMISSION['USER:READ'])
  @Query(() => UserObject)
  async user(
    @Args('id', { type: () => ID }) id: UserObject['id'],
    @GraphQLUser() authzUser: AuthzUser,
  ) {
    this.logger.log(`Fetching user with id ${id.toString()}`)

    const user = await this.resolverService.getOneByIDWithActionScopeConstraint(id, authzUser)
    if (!user) throw new NotFoundException(`We could not found an user with id ${id}`)

    return user
  }

  @ResolveField()
  async keyResults(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching key results for user',
    })

    return this.keyResultDomain.getFromOwner(user.id)
  }

  @ResolveField()
  async objectives(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching objectives for user',
    })

    return this.objectiveDomain.getFromOwner(user.id)
  }

  @ResolveField()
  async progressReports(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching progress reports for user',
    })

    return this.keyResultDomain.report.progress.getFromUser(user.id)
  }

  @ResolveField()
  async confidenceReports(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching confidence reports for user',
    })

    return this.keyResultDomain.report.confidence.getFromUser(user.id)
  }

  @ResolveField()
  async ownedTeams(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching owned teams for user',
    })

    return this.teamDomain.getFromOwner(user.id)
  }

  @ResolveField()
  async ownedCompanies(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching owned companies for user',
    })

    return this.companyDomain.getFromOwner(user.id)
  }
}

export default GraphQLUserResolver
