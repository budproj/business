import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSIONS } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainKeyResultService from 'domain/key-result/service'
import DomainUserService from 'domain/user/service'

import { UserObject } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => UserObject)
class GraphQLUserResolver {
  private readonly logger = new Logger(GraphQLUserResolver.name)

  constructor(
    private readonly keyResultService: DomainKeyResultService,
    private readonly userService: DomainUserService,
  ) {}

  @Permissions(PERMISSIONS['USER:READ'])
  @Query(() => UserObject)
  async user(
    @Args('id', { type: () => ID }) id: UserObject['id'],
    @GraphQLUser() authzUser: AuthzUser,
  ) {
    this.logger.log(`Fetching user with id ${id.toString()}`)

    const user = await this.userService.getOneByIdIfUserShareCompany(id, authzUser)
    if (!user) throw new NotFoundException(`We could not found an user with id ${id}`)

    return user
  }

  @ResolveField()
  async keyResults(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching key results for user',
    })

    return this.keyResultService.getFromOwner(user.id)
  }

  @ResolveField()
  async progressReports(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching progress reports for user',
    })

    return this.keyResultService.report.progress.getFromUser(user.id)
  }

  @ResolveField()
  async confidenceReports(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching confidence reports for user',
    })

    return this.keyResultService.report.confidence.getFromUser(user.id)
  }
}

export default GraphQLUserResolver
