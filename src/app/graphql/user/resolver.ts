import { Logger, NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import ConfidenceReportService from 'domain/confidence-report/service'
import KeyResultService from 'domain/key-result/service'
import ProgressReportService from 'domain/progress-report/service'
import { UserDTO } from 'domain/user/dto'
import UserService from 'domain/user/service'

import { User } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@Resolver(() => User)
class UserResolver {
  private readonly logger = new Logger(UserResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly userService: UserService,
    private readonly progressReportService: ProgressReportService,
    private readonly confidenceReportService: ConfidenceReportService,
  ) {}

  @Permissions('read:users')
  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: UserDTO['id']) {
    this.logger.log(`Fetching user with id ${id.toString()}`)

    const user = await this.userService.getOneById(id)
    if (!user) throw new NotFoundException(`Sorry, we could not found an user with id ${id}`)

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

    return this.progressReportService.getFromUser(user.id)
  }

  @ResolveField()
  async confidenceReports(@Parent() user: User) {
    this.logger.log({
      user,
      message: 'Fetching confidence reports for user',
    })

    return this.confidenceReportService.getFromUser(user.id)
  }
}

export default UserResolver
