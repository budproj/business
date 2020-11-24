import { Logger, NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, PermissionsGuard } from 'app/authz/guards'
import { KeyResultViewDTO } from 'domain/key-result-view/dto'
import KeyResultViewService from 'domain/key-result-view/service'
import KeyResultService from 'domain/key-result/service'
import UserService from 'domain/user/service'

import { KeyResultView } from './models'

@UseGuards(GraphQLAuthGuard, PermissionsGuard)
@Resolver(() => KeyResultView)
class KeyResultViewResolver {
  private readonly logger = new Logger(KeyResultViewResolver.name)

  constructor(
    private readonly keyResultViewService: KeyResultViewService,
    private readonly keyResultService: KeyResultService,
    private readonly userService: UserService,
  ) {}

  @Permissions('read:key-result-views')
  @Query(() => KeyResultView)
  async keyResultView(@Args('id', { type: () => Int }) id: KeyResultViewDTO['id']) {
    this.logger.log(`Fetching key result view with id ${id.toString()}`)

    const keyResultView = await this.keyResultViewService.getOneById(id)
    if (!keyResultView)
      throw new NotFoundException(`Sorry, we could not found a key result view with id ${id}`)

    return keyResultView
  }

  @ResolveField()
  async user(@Parent() keyResultView: KeyResultViewDTO) {
    this.logger.log({
      keyResultView,
      message: 'Fetching user for key result view',
    })

    return this.userService.getOneById(keyResultView.userId)
  }

  @ResolveField()
  async keyResults(@Parent() keyResultView: KeyResultViewDTO) {
    this.logger.log({
      keyResultView,
      message: 'Fetching key results for key result view',
    })

    return this.keyResultService.getManyByIdsPreservingOrder(keyResultView.rank)
  }
}

export default KeyResultViewResolver
