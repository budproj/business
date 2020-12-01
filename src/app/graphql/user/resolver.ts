import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import KeyResultReportService from 'domain/key-result-report/service'
import KeyResultService from 'domain/key-result/service'
import { UserDTO } from 'domain/user/dto'
import UserService from 'domain/user/service'

import { User } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => User)
class UserResolver {
  private readonly logger = new Logger(UserResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly userService: UserService,
    private readonly keyResultReportService: KeyResultReportService,
  ) {}

  @Permissions('read:users')
  @Query(() => User)
  async user(
    @Args('id', { type: () => Int }) id: UserDTO['id'],
    @GraphQLUser() authzUser: AuthzUser,
  ) {
    this.logger.log(`Fetching user with id ${id.toString()}`)

    const user = await this.userService.getOneByIdIfUserShareCompany(id, authzUser)
    if (!user) throw new NotFoundException(`We could not found an user with id ${id}`)

    return user
  }

  @ResolveField()
  async keyResults(@Parent() user: User) {
    this.logger.log({
      user,
      message: 'Fetching key results for user',
    })

    return this.keyResultService.getFromOwner(user.id)
  }

  @ResolveField()
  async progressReports(@Parent() user: User) {
    this.logger.log({
      user,
      message: 'Fetching progress reports for user',
    })

    return this.keyResultReportService.progressReportService.getFromUser(user.id)
  }

  @ResolveField()
  async confidenceReports(@Parent() user: User) {
    this.logger.log({
      user,
      message: 'Fetching confidence reports for user',
    })

    return this.keyResultReportService.confidenceReportService.getFromUser(user.id)
  }
}

export default UserResolver
