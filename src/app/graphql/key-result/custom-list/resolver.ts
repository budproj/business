import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Query, Resolver } from '@nestjs/graphql'
import { pickBy, identity } from 'lodash'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
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
    super(RESOURCE.USER, domain, domain.keyResult.customList)
  }

  @Permissions(PERMISSION['KEY_RESULT_VIEW:READ'])
  @Query(() => KeyResultCustomListObject, { name: 'keyResultCustomList' })
  protected async getKeyResultCustomList(
    @GraphQLUser() user: AuthzUser,
    @Args('id', { type: () => ID, nullable: true }) id?: KeyResultCustomListObject['id'],
    @Args('binding', { type: () => KEY_RESULT_CUSTOM_LIST_BINDING, nullable: true })
    binding?: KeyResultCustomListObject['binding'],
  ) {
    this.logger.log('Fetching key result view')

    const selector = pickBy(
      {
        id,
        binding,
      },
      identity,
    )
    const keyResultView = await this.getOneWithActionScopeConstraint(selector, user)
    // If (!keyResultView && binding === KEY_RESULT_CUSTOM_LIST_BINDING.MINE) {
    //   const createdKeyResultCustomLists = await this.createWithScopeConstraint(
    //     {
    //       binding,
    //       title: 'Default',
    //       userId: user.id,
    //     },
    //     user,
    //   )
    //
    //   return createdKeyResultCustomLists[0]
    // }

    if (!keyResultView)
      throw new NotFoundException('We could not found a key result view with given args')

    return keyResultView
  }

  // @ResolveField()
  // async user(@Parent() keyResultView: KeyResultCustomListObject) {
  //   this.logger.log({
  //     keyResultView,
  //     message: 'Fetching user for key result view',
  //   })
  //
  //   return this.userDomain.getOne({ id: keyResultView.userId })
  // }
  //
  // @ResolveField()
  // async keyResults(@Parent() keyResultView: KeyResultCustomListObject) {
  //   this.logger.log({
  //     keyResultView,
  //     message: 'Fetching key results for key result view',
  //   })
  //
  //   return this.keyResultDomain.getManyByIdsPreservingOrder(keyResultView.rank)
  // }
  //
  // @Permissions(PERMISSION['KEY_RESULT_VIEW:UPDATE'])
  // @Mutation(() => KeyResultCustomListObject)
  // async updateRank(
  //   @Args('id', { type: () => ID }) id: KeyResultCustomListObject['id'],
  //   @Args('keyResultViewRankInput', { type: () => KeyResultCustomListRankInput })
  //   keyResultViewRankInput: KeyResultCustomListRankInput,
  //   @GraphQLUser() user: AuthzUser,
  // ) {
  //   this.logger.log({
  //     keyResultViewRankInput,
  //     message: `Updating rank for key result view of id ${id}`,
  //   })
  //
  //   const updatedKeyResultCustomList = await this.resolverService.updateWithScopeConstraint(
  //     { id },
  //     keyResultViewRankInput,
  //     user,
  //   )
  //   if (!updatedKeyResultCustomList)
  //     throw new NotFoundException(`We could not found a key result view for id ${id}`)
  //
  //   return updatedKeyResultCustomList
  // }
  //
  // @Permissions(PERMISSION['KEY_RESULT_VIEW:CREATE'])
  // @Mutation(() => KeyResultCustomListObject)
  // async createKeyResultCustomList(
  //   @GraphQLUser() user: AuthzUser,
  //   @Args('keyResultViewInput', { type: () => KeyResultCustomListInput })
  //   keyResultViewInput: KeyResultCustomListInput,
  // ) {
  //   this.logger.log({
  //     user,
  //     keyResultViewInput,
  //     message: 'Creating a new key result view',
  //   })
  //
  //   const enhancedWithUserID = {
  //     userId: user.id,
  //     ...keyResultViewInput,
  //   }
  //
  //   const creationPromise = this.resolverService.createWithScopeConstraint(enhancedWithUserID, user)
  //   const [error, createdKeyResultCustomList] = await this.railway.handleRailwayPromise<
  //     RailwayError,
  //     KeyResultCustomList[]
  //   >(creationPromise)
  //   if (error?.code === '23505')
  //     throw new PreconditionFailedException('View bindings must be unique')
  //   if (error) throw new InternalServerErrorException('Unknown error')
  //   if (!createdKeyResultCustomList)
  //     throw new NotFoundException(
  //       `We could not found an user with ID ${enhancedWithUserID.userId} to create your view`,
  //     )
  //
  //   return createdKeyResultCustomList[0]
  // }
}

export default GraphQLKeyResultCustomListResolver
