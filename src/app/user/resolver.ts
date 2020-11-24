import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import KeyResultService from 'domain/key-result/service'
import UserService from 'domain/user/service'

import { User } from './models'

@Resolver(() => User)
class UserResolver {
  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly userService: UserService,
  ) {}

  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: number) {
    return this.userService.getOneById(id)
  }

  @ResolveField()
  async keyResults(@Parent() user: User) {
    const { keyResults } = user
    const keyResultIDS = keyResults.map((keyResult) => keyResult.id)

    return this.keyResultService.getManyWithIDS(keyResultIDS)
  }
}

export default UserResolver
