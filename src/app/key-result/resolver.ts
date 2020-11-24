import { UseGuards } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, PermissionsGuard } from 'app/authz/guards'
import { KeyResultDTO } from 'domain/key-result/dto'
import KeyResultService from 'domain/key-result/service'
import UserService from 'domain/user/service'

import { KeyResult } from './models'

@UseGuards(GraphQLAuthGuard, PermissionsGuard)
@Resolver(() => KeyResult)
class KeyResultResolver {
  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly userService: UserService,
  ) {}

  @Permissions('read:key-results')
  @Query(() => KeyResult)
  async keyResult(@Args('id', { type: () => Int }) id: number) {
    return this.keyResultService.getOneById(id)
  }

  @ResolveField()
  async owner(@Parent() keyResult: KeyResultDTO) {
    const { ownerId } = keyResult
    return this.userService.getOneById(ownerId)
  }
}

export default KeyResultResolver
