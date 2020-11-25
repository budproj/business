import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  registerEnumType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import KeyResultViewResolverService, {
  KeyResultViewResolverRequest,
} from 'app/graphql/key-result-view/service'
import { KeyResultViewBinding, KeyResultViewDTO } from 'domain/key-result-view/dto'
import KeyResultViewService from 'domain/key-result-view/service'
import KeyResultService from 'domain/key-result/service'
import UserService from 'domain/user/service'

import { KeyResultView } from './models'

registerEnumType(KeyResultViewBinding, {
  name: 'KeyResultViewBinding',
  description: 'Each binding represents a given view in our applications',
})

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultView)
class KeyResultViewResolver {
  private readonly logger = new Logger(KeyResultViewResolver.name)

  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly userService: UserService,
    private readonly service: KeyResultViewResolverService,
    private readonly keyResultViewService: KeyResultViewService,
  ) {}

  @Permissions('read:key-result-views')
  @Query(() => KeyResultView)
  async keyResultView(
    @GraphQLUser() user: AuthzUser,
    @Args('id', { type: () => Int, nullable: true }) id?: KeyResultViewDTO['id'],
    @Args('binding', { type: () => KeyResultViewBinding, nullable: true })
    binding?: KeyResultViewBinding,
  ) {
    this.logger.log('Fetching key result view')
    const requestOptions: KeyResultViewResolverRequest = {
      id,
      user,
      binding,
    }

    const keyResultView = await this.service.handleQueryRequest(requestOptions)
    if (!keyResultView)
      throw new NotFoundException('We could not found a key result view with given args')

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

  @Mutation(() => KeyResultView)
  async updateRank(
    @Args('id', { type: () => Int }) id: KeyResultViewDTO['id'],
    @Args('rank', { type: () => [Int] }) rank: KeyResultViewDTO['rank'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log({
      rank,
      message: `Updating rank for key result view of id ${id}`,
    })

    const updatedKeyResultView = await this.keyResultViewService.updateRankIfUserOwnsIt(
      id,
      rank,
      user,
    )
    if (!updatedKeyResultView)
      throw new NotFoundException(`We could not found a key result view for id ${id}`)

    return updatedKeyResultView
  }
}

export default KeyResultViewResolver
