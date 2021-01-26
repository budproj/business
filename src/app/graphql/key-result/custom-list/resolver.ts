import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { pickBy, identity } from 'lodash'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { UserObject } from 'src/app/graphql/user'
import { KEY_RESULT_CUSTOM_LIST_BINDING } from 'src/domain/key-result/custom-list/constants'
import { KeyResultCustomListDTO } from 'src/domain/key-result/custom-list/dto'
import { KeyResultCustomList } from 'src/domain/key-result/custom-list/entities'
import DomainService from 'src/domain/service'

import { KeyResultCustomListObject } from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultCustomListObject)
class GraphQLKeyResultCustomListResolver extends GraphQLEntityResolver<
  KeyResultCustomList,
  KeyResultCustomListDTO
> {
  private readonly logger = new Logger(GraphQLKeyResultCustomListResolver.name)

  constructor(protected readonly domain: DomainService) {
    super(RESOURCE.KEY_RESULT, domain, domain.keyResult.customList)
  }

  @Permissions(PERMISSION['KEY_RESULT:READ'])
  @Query(() => KeyResultCustomListObject, { name: 'keyResultCustomList' })
  protected async getKeyResultCustomList(
    @GraphQLUser() user: AuthzUser,
    @Args('id', { type: () => ID, nullable: true }) id?: KeyResultCustomListObject['id'],
    @Args('binding', { type: () => KEY_RESULT_CUSTOM_LIST_BINDING, nullable: true })
    binding?: KeyResultCustomListObject['binding'],
  ) {
    this.logger.log('Fetching key result custom list')

    const selector = pickBy(
      {
        id,
        binding,
      },
      identity,
    )
    const keyResultCustomList = await this.getOneWithActionScopeConstraint(selector, user)
    if (!keyResultCustomList && !binding)
      throw new NotFoundException('We could not found a key result custom list with given args')

    const normalizedKeyResultCustomList = await this.normalizedBasedOnBinding(
      binding,
      user,
      keyResultCustomList,
    )

    console.log(normalizedKeyResultCustomList)

    if (!normalizedKeyResultCustomList)
      throw new NotFoundException('We could not found a key result custom list with given args')

    return normalizedKeyResultCustomList
  }

  @ResolveField('user', () => UserObject)
  protected async getKeyResultCustomListUser(
    @Parent() keyResultCustomList: KeyResultCustomListObject,
  ) {
    this.logger.log({
      keyResultCustomList,
      message: 'Fetching user for key result custom list',
    })

    return this.domain.user.getOne({ id: keyResultCustomList.userId })
  }

  @ResolveField('keyResults', () => [KeyResultObject])
  protected async getKeyResultCustomListKeyResults(
    @Parent() keyResultCustomList: KeyResultCustomListObject,
  ) {
    this.logger.log({
      keyResultCustomList,
      message: 'Fetching key results for key result custom list',
    })

    return this.domain.keyResult.getFromCustomList(keyResultCustomList)
  }

  private async normalizedBasedOnBinding(
    binding: KEY_RESULT_CUSTOM_LIST_BINDING,
    user: AuthzUser,
    keyResultCustomList?: KeyResultCustomListDTO,
  ) {
    return keyResultCustomList
      ? this.domain.keyResult.refreshCustomListWithOwnedKeyResults(user, keyResultCustomList)
      : this.domain.keyResult.createCustomListForBinding(binding, user)
  }

  // @Permissions(PERMISSION['KEY_RESULT_VIEW:UPDATE'])
  // @Mutation(() => KeyResultCustomListObject)
  // async updateRank(
  //   @Args('id', { type: () => ID }) id: KeyResultCustomListObject['id'],
  //   @Args('keyResultCustomListRankInput', { type: () => KeyResultCustomListRankInput })
  //   keyResultCustomListRankInput: KeyResultCustomListRankInput,
  //   @GraphQLUser() user: AuthzUser,
  // ) {
  //   this.logger.log({
  //     keyResultCustomListRankInput,
  //     message: `Updating rank for key result custom list of id ${id}`,
  //   })
  //
  //   const updatedKeyResultCustomList = await this.resolverService.updateWithScopeConstraint(
  //     { id },
  //     keyResultCustomListRankInput,
  //     user,
  //   )
  //   if (!updatedKeyResultCustomList)
  //     throw new NotFoundException(`We could not found a key result custom list for id ${id}`)
  //
  //   return updatedKeyResultCustomList
  // }
}

export default GraphQLKeyResultCustomListResolver
