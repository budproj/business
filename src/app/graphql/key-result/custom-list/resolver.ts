import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'
import { pickBy, identity } from 'lodash'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import AuthzService from 'src/app/authz/service'
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

import { KeyResultCustomListObject, KeyResultCustomListInput } from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultCustomListObject)
class GraphQLKeyResultCustomListResolver extends GraphQLEntityResolver<
  KeyResultCustomList,
  KeyResultCustomListDTO
> {
  private readonly logger = new Logger(GraphQLKeyResultCustomListResolver.name)

  constructor(
    protected readonly domain: DomainService,
    protected readonly authzService: AuthzService,
  ) {
    super(RESOURCE.KEY_RESULT_CUSTOM_LIST, domain, domain.keyResult.customList, authzService)
  }

  @Permissions(PERMISSION['KEY_RESULT_CUSTOM_LIST:READ'])
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
      throw new UserInputError('We could not found a key result custom list with given args')

    const normalizedKeyResultCustomList = await this.normalizedBasedOnBinding(
      binding,
      user,
      keyResultCustomList,
    )

    if (!normalizedKeyResultCustomList)
      throw new UserInputError('We could not found a key result custom list with given args')

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

  @ResolveField('keyResults', () => [KeyResultObject], { nullable: true })
  protected async getKeyResultCustomListKeyResults(
    @Parent() keyResultCustomList: KeyResultCustomListObject,
  ) {
    this.logger.log({
      keyResultCustomList,
      message: 'Fetching key results for key result custom list',
    })

    if (keyResultCustomList.rank.length === 0) return

    return this.domain.keyResult.getFromCustomList(keyResultCustomList)
  }

  @Permissions(PERMISSION['KEY_RESULT_CUSTOM_LIST:UPDATE'])
  @Mutation(() => KeyResultCustomListObject, { name: 'updateKeyResultCustomList' })
  protected async updateKeyResultCustomList(
    @Args('id', { type: () => ID }) id: KeyResultCustomListObject['id'],
    @Args('keyResultCustomListInput', { type: () => KeyResultCustomListInput })
    keyResultCustomListInput: KeyResultCustomListInput,
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log({
      keyResultCustomListInput,
      message: `Updating rank for key result custom list of id ${id}`,
    })

    const updatedKeyResultCustomList = await this.updateWithActionScopeConstraint(
      { id },
      keyResultCustomListInput,
      user,
    )
    if (!updatedKeyResultCustomList)
      throw new UserInputError(`We could not found a key result custom list for id ${id}`)

    return updatedKeyResultCustomList
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
}

export default GraphQLKeyResultCustomListResolver
