import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'

import { KeyResultCheckInNodeGraphQLObject } from '../../objects/key-result/check-in/key-result-check-in-node.object'
import { KeyResultNodeGraphQLObject } from '../../objects/key-result/key-result-node.object'
import { ObjectiveNodeGraphQLObject } from '../../objects/objetive/objective-node.object'
import { TeamNodeGraphQLObject } from '../../objects/team/team-node.object'
import { UserListGraphQLObject } from '../../objects/user/user-list.object'
import { UserNodeGraphQLObject } from '../../objects/user/user-node.object'
import { CursorPaginationRequest } from '../../requests/cursor-pagination.request'
import { UserFiltersRequest } from '../../requests/user/user-filters.request'
import { UserUpdateRequest } from '../../requests/user/user-update.request'
import { UserRootEdgeGraphQLResponse } from '../../responses/user/user-root-edge.response'
import { BaseGraphQLResolver } from '../base.resolver'
import { GraphQLUser } from '../decorators/graphql-user'
import { GraphQLRequiredPoliciesGuard } from '../guards/required-policies.guard'
import { GraphQLTokenGuard } from '../guards/token.guard'
import { NourishUserDataInterceptor } from '../interceptors/nourish-user-data.interceptor'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => UserNodeGraphQLObject)
export class UserGraphQLResolver extends BaseGraphQLResolver<User, UserInterface> {
  private readonly logger = new Logger(UserGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.USER, core, core.user)
  }

  @RequiredActions('user:read')
  @Query(() => UserListGraphQLObject, { name: 'users' })
  protected async getUsers(
    @Args() { first, ...filters }: UserFiltersRequest,
    @GraphQLUser() graphqlUser: AuthorizationUser,
  ) {
    this.logger.log({
      first,
      filters,
      graphqlUser,
      message: 'Fetching users with filters',
    })

    const queryOptions: GetOptions<User> = {
      limit: first,
    }
    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      graphqlUser,
      queryOptions,
    )

    const edges = queryResult?.map((node) => new UserRootEdgeGraphQLResponse({ node }))
    const response = this.marshalListResponse<UserRootEdgeGraphQLResponse>(edges)

    return response
  }

  @RequiredActions('user:read')
  @Query(() => UserNodeGraphQLObject, { name: 'me' })
  protected async getMyUser(@GraphQLUser() graphqlUser: AuthorizationUser) {
    const { id } = graphqlUser
    this.logger.log(
      `Fetching data about the user that is executing the request. Provided user ID: ${id.toString()}`,
    )

    const user = await this.queryGuard.getOneWithActionScopeConstraint({ id }, graphqlUser)
    if (!user) throw new UserInputError(`We could not found an user with ID ${id}`)

    return user
  }

  @RequiredActions('user:update')
  @Mutation(() => UserNodeGraphQLObject, { name: 'updateUser' })
  protected async updateUser(
    @GraphQLUser() graphqlUser: AuthorizationUser,
    @Args() request: UserUpdateRequest,
  ) {
    this.logger.log({
      graphqlUser,
      request,
      message: 'Received update user request',
    })

    const user = await this.queryGuard.updateWithActionScopeConstraint(
      { id: request.id },
      request.data,
      graphqlUser,
    )
    if (!user) throw new UserInputError(`We could not found an user with ID ${request.id}`)

    return user
  }

  @ResolveField('fullName', () => String)
  protected async getUserFullName(@Parent() user: UserNodeGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching user full name',
    })

    return this.core.user.buildUserFullName(user)
  }

  @ResolveField('companies', () => [TeamNodeGraphQLObject], { nullable: true })
  protected async getUserCompanies(
    @Parent() user: UserNodeGraphQLObject,
    @Args() pagination?: CursorPaginationRequest,
  ) {
    this.logger.log({
      user,
      pagination,
      message: 'Fetching companies for user',
    })

    const queryOptions: GetOptions<Team> = {
      limit: pagination.first,
    }
    const companies = await this.core.team.getUserCompanies(user, undefined, queryOptions)

    return companies
  }

  @ResolveField('teams', () => [TeamNodeGraphQLObject], { nullable: true })
  protected async getUserTeams(@Parent() user: UserNodeGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching teams for user',
    })

    const teams = await this.core.team.getWithUser(user)

    return teams
  }

  @ResolveField('ownedTeams', () => [TeamNodeGraphQLObject], { nullable: true })
  protected async getUserOwnedTeams(@Parent() user: UserNodeGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching owned teams for user',
    })

    return this.core.team.getFromOwner(user)
  }

  @ResolveField('objectives', () => [ObjectiveNodeGraphQLObject], { nullable: true })
  protected async getUserObjectives(@Parent() user: UserNodeGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching objectives for user',
    })

    return this.core.objective.getFromOwner(user)
  }

  @ResolveField('keyResults', () => [KeyResultNodeGraphQLObject], { nullable: true })
  protected async getUserKeyResults(@Parent() user: UserNodeGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching key results for user',
    })

    return this.core.keyResult.getFromOwner(user)
  }

  @ResolveField('keyResultCheckIns', () => [KeyResultCheckInNodeGraphQLObject], { nullable: true })
  protected async getUserKeyResultCheckIns(@Parent() user: UserNodeGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching check-ins by user',
    })

    return this.core.keyResult.getCheckInsByUser(user)
  }
}