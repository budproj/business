import { Logger, UseGuards } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, PermissionsGuard } from 'app/authz/guards'
import KeyResultService from 'domain/key-result/service'
import { UserDTO } from 'domain/user/dto'
import UserService from 'domain/user/service'

import { User } from './models'

@UseGuards(GraphQLAuthGuard, PermissionsGuard)
@Resolver(() => User)
class UserResolver {
  private readonly logger = new Logger(UserResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly userService: UserService,
  ) {}

  @Permissions('read:users')
  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: UserDTO['id']) {
    this.logger.log(`Fetching user with id ${id.toString()}`)

    return this.userService.getOneById(id)
  }

  @ResolveField()
  async keyResults(@Parent() user: User) {
    this.logger.log({
      user,
      message: 'Fetching key results for user',
    })

    return this.keyResultService.getOwnedBy(user.id)
  }
}

export default UserResolver
