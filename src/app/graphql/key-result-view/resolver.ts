import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
  PreconditionFailedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Args, ID, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import { RailwayError } from 'app/errors'
import KeyResultViewResolverService, {
  KeyResultViewResolverRequest,
} from 'app/graphql/key-result-view/service'
import { Railway } from 'app/providers'
import { KeyResultViewBinding, KeyResultViewDTO } from 'domain/key-result-view/dto'
import { KeyResultView as KeyResultViewEntity } from 'domain/key-result-view/entities'
import KeyResultViewService from 'domain/key-result-view/service'
import KeyResultService from 'domain/key-result/service'
import UserService from 'domain/user/service'

import { KeyResultView, KeyResultViewInput, KeyResultViewRankInput } from './models'

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
    private readonly railway: Railway,
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
  async keyResults(@Parent() keyResultView: KeyResultViewDTO, @GraphQLUser() user: AuthzUser) {
    this.logger.log({
      keyResultView,
      message: 'Fetching key results for key result view',
    })

    return this.keyResultService.getManyByIdsPreservingOrderIfUserIsInCompany(
      keyResultView.rank,
      user,
    )
  }

  @Mutation(() => KeyResultView)
  async updateRank(
    @Args('id', { type: () => ID }) id: KeyResultViewDTO['id'],
    @Args('keyResultViewRankInput', { type: () => KeyResultViewRankInput })
    keyResultViewRankInput: Partial<KeyResultViewDTO>,
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log({
      keyResultViewRankInput,
      message: `Updating rank for key result view of id ${id}`,
    })

    const updatedKeyResultView = await this.keyResultViewService.updateRankIfUserOwnsIt(
      id,
      keyResultViewRankInput.rank,
      user,
    )
    if (!updatedKeyResultView)
      throw new NotFoundException(`We could not found a key result view for id ${id}`)

    return updatedKeyResultView
  }

  @Mutation(() => KeyResultView)
  async createKeyResultView(
    @GraphQLUser() user: AuthzUser,
    @Args('keyResultViewInput', { type: () => KeyResultViewInput })
    keyResultViewInput: Partial<KeyResultViewDTO>,
  ) {
    this.logger.log({
      user,
      keyResultViewInput,
      message: 'Creating a new key result view',
    })

    const enhancedWithUserID = {
      ...keyResultViewInput,
      userId: user.id,
    }

    const creationPromise = this.keyResultViewService.create(enhancedWithUserID)
    const [error, createdKeyResultView] = await this.railway.handleRailwayPromise<
      RailwayError,
      KeyResultViewEntity[]
    >(creationPromise)
    if (error?.code === '23505')
      throw new PreconditionFailedException('View bindings must be unique')
    if (error) throw new InternalServerErrorException('Unknown error')

    return createdKeyResultView[0]
  }
}

export default KeyResultViewResolver
