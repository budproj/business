import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
  PreconditionFailedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { pickBy, identity } from 'lodash'

import { PERMISSION } from 'src/app/authz/constants'
import { GraphQLUser, Permissions } from 'src/app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'src/app/authz/guards'
import { EnhanceWithBudUser } from 'src/app/authz/interceptors'
import { AuthzUser } from 'src/app/authz/types'
import { Railway } from 'src/app/providers'
import DomainKeyResultService from 'src/domain/key-result/service'
import DomainUserService from 'src/domain/user/service'
import { KEY_RESULT_CUSTOM_LIST_BINDING } from 'src/domain/key-result/custom-list/constants'
import { KeyResultCustomList } from 'src/domain/key-result/custom-list/entities'
import { RailwayError } from 'src/errors'

import {
  KeyResultCustomListObject,
  KeyResultCustomListInput,
  KeyResultCustomListRankInput,
} from './models'
import GraphQLKeyResultCustomListService from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultCustomListObject)
class GraphQLKeyResultCustomListResolver {
  private readonly logger = new Logger(GraphQLKeyResultCustomListResolver.name)

  constructor(
    private readonly resolverService: GraphQLKeyResultCustomListService,
    private readonly keyResultDomain: DomainKeyResultService,
    private readonly userDomain: DomainUserService,
    private readonly railway: Railway,
  ) {}

  @Permissions(PERMISSION['KEY_RESULT_VIEW:READ'])
  @Query(() => KeyResultCustomListObject)
  async keyResultView(
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
    const keyResultView = await this.resolverService.getOneWithActionScopeConstraint(selector, user)
    if (!keyResultView && binding === KEY_RESULT_CUSTOM_LIST_BINDING.MINE) {
      const createdKeyResultCustomLists = await this.resolverService.createWithScopeConstraint(
        {
          binding,
          title: 'Default',
          userId: user.id,
        },
        user,
      )

      return createdKeyResultCustomLists[0]
    }

    if (!keyResultView)
      throw new NotFoundException('We could not found a key result view with given args')

    return keyResultView
  }

  @ResolveField()
  async user(@Parent() keyResultView: KeyResultCustomListObject) {
    this.logger.log({
      keyResultView,
      message: 'Fetching user for key result view',
    })

    return this.userDomain.getOne({ id: keyResultView.userId })
  }

  @ResolveField()
  async keyResults(@Parent() keyResultView: KeyResultCustomListObject) {
    this.logger.log({
      keyResultView,
      message: 'Fetching key results for key result view',
    })

    return this.keyResultDomain.getManyByIdsPreservingOrder(keyResultView.rank)
  }

  @Permissions(PERMISSION['KEY_RESULT_VIEW:UPDATE'])
  @Mutation(() => KeyResultCustomListObject)
  async updateRank(
    @Args('id', { type: () => ID }) id: KeyResultCustomListObject['id'],
    @Args('keyResultViewRankInput', { type: () => KeyResultCustomListRankInput })
    keyResultViewRankInput: KeyResultCustomListRankInput,
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log({
      keyResultViewRankInput,
      message: `Updating rank for key result view of id ${id}`,
    })

    const updatedKeyResultCustomList = await this.resolverService.updateWithScopeConstraint(
      { id },
      keyResultViewRankInput,
      user,
    )
    if (!updatedKeyResultCustomList)
      throw new NotFoundException(`We could not found a key result view for id ${id}`)

    return updatedKeyResultCustomList
  }

  @Permissions(PERMISSION['KEY_RESULT_VIEW:CREATE'])
  @Mutation(() => KeyResultCustomListObject)
  async createKeyResultCustomList(
    @GraphQLUser() user: AuthzUser,
    @Args('keyResultViewInput', { type: () => KeyResultCustomListInput })
    keyResultViewInput: KeyResultCustomListInput,
  ) {
    this.logger.log({
      user,
      keyResultViewInput,
      message: 'Creating a new key result view',
    })

    const enhancedWithUserID = {
      userId: user.id,
      ...keyResultViewInput,
    }

    const creationPromise = this.resolverService.createWithScopeConstraint(enhancedWithUserID, user)
    const [error, createdKeyResultCustomList] = await this.railway.handleRailwayPromise<
      RailwayError,
      KeyResultCustomList[]
    >(creationPromise)
    if (error?.code === '23505')
      throw new PreconditionFailedException('View bindings must be unique')
    if (error) throw new InternalServerErrorException('Unknown error')
    if (!createdKeyResultCustomList)
      throw new NotFoundException(
        `We could not found an user with ID ${enhancedWithUserID.userId} to create your view`,
      )

    return createdKeyResultCustomList[0]
  }
}

export default GraphQLKeyResultCustomListResolver
