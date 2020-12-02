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
import { Railway } from 'app/providers'
import DomainKeyResultService from 'domain/key-result/service'
import DomainUserService from 'domain/user/service'
import { KeyResultView } from 'domain/user/view/key-result/entities'
import { KeyResultViewBinding } from 'domain/user/view/key-result/types'

import { KeyResultViewObject, KeyResultViewInput, KeyResultViewRankInput } from './models'
import KeyResultViewResolverService, {
  GraphQLKeyResultViewHandleQueryRequestProperties,
} from './service'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => KeyResultViewObject)
class GraphQLKeyResultViewResolver {
  private readonly logger = new Logger(GraphQLKeyResultViewResolver.name)

  constructor(
    private readonly keyResultService: DomainKeyResultService,
    private readonly userService: DomainUserService,
    private readonly service: KeyResultViewResolverService,
    private readonly railway: Railway,
  ) {}

  @Permissions('read:key-result-views')
  @Query(() => KeyResultViewObject)
  async keyResultView(
    @GraphQLUser() user: AuthzUser,
    @Args('id', { type: () => Int, nullable: true }) id?: KeyResultViewObject['id'],
    @Args('binding', { type: () => KeyResultViewBinding, nullable: true })
    binding?: KeyResultViewObject['binding'],
  ) {
    this.logger.log('Fetching key result view')
    const requestOptions: GraphQLKeyResultViewHandleQueryRequestProperties = {
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
  async user(@Parent() keyResultView: KeyResultViewObject) {
    this.logger.log({
      keyResultView,
      message: 'Fetching user for key result view',
    })

    return this.userService.getOneById(keyResultView.userId)
  }

  @ResolveField()
  async keyResults(@Parent() keyResultView: KeyResultViewObject, @GraphQLUser() user: AuthzUser) {
    this.logger.log({
      keyResultView,
      message: 'Fetching key results for key result view',
    })

    return this.keyResultService.getManyByIdsPreservingOrderIfUserIsInCompany(
      keyResultView.rank,
      user,
    )
  }

  @Mutation(() => KeyResultViewObject)
  async updateRank(
    @Args('id', { type: () => ID }) id: KeyResultViewObject['id'],
    @Args('keyResultViewRankInput', { type: () => KeyResultViewRankInput })
    keyResultViewRankInput: KeyResultViewRankInput,
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log({
      keyResultViewRankInput,
      message: `Updating rank for key result view of id ${id}`,
    })

    const updatedKeyResultView = await this.userService.view.keyResult.updateRankIfUserOwnsIt(
      id,
      keyResultViewRankInput.rank,
      user,
    )
    if (!updatedKeyResultView)
      throw new NotFoundException(`We could not found a key result view for id ${id}`)

    return updatedKeyResultView
  }

  @Mutation(() => KeyResultViewObject)
  async createKeyResultView(
    @GraphQLUser() user: AuthzUser,
    @Args('keyResultViewInput', { type: () => KeyResultViewInput })
    keyResultViewInput: KeyResultViewInput,
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

    const creationPromise = this.userService.view.keyResult.create(enhancedWithUserID)
    const [error, createdKeyResultView] = await this.railway.handleRailwayPromise<
      RailwayError,
      KeyResultView[]
    >(creationPromise)
    if (error?.code === '23505')
      throw new PreconditionFailedException('View bindings must be unique')
    if (error) throw new InternalServerErrorException('Unknown error')

    return createdKeyResultView[0]
  }
}

export default GraphQLKeyResultViewResolver