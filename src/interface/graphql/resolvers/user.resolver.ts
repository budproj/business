import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { UsersQueryResultGraphQLObject } from '@interface/graphql/objects/user-query.object'
import { UserGraphQLObject } from '@interface/graphql/objects/user.object'
import { UserFiltersRequest } from '@interface/graphql/requests/user/user-filters.request'

import { UserUpdateRequest } from '../requests/user/user-update.request'

import { BaseGraphQLResolver } from './base.resolver'
import { GraphQLUser } from './decorators/graphql-user'
import { GraphQLRequiredPoliciesGuard } from './guards/required-policies.guard'
import { GraphQLTokenGuard } from './guards/token.guard'
import { NourishUserDataInterceptor } from './interceptors/nourish-user-data.interceptor'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => UserGraphQLObject)
export class UserGraphQLResolver extends BaseGraphQLResolver<User, UserInterface> {
  private readonly logger = new Logger(UserGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.USER, core, core.user)
  }

  @RequiredActions('user:read')
  @Query(() => UsersQueryResultGraphQLObject, { name: 'users' })
  protected async getUsers(
    @Args() filters: UserFiltersRequest,
    @GraphQLUser() graphqlUser: AuthorizationUser,
  ) {
    this.logger.log({
      filters,
      graphqlUser,
      message: 'Fetching user with filters',
    })

    const selectedUsers = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      graphqlUser,
    )

    const queryResult = this.marshalQueryResult(selectedUsers)

    return queryResult
  }

  @RequiredActions('user:read')
  @Query(() => UserGraphQLObject, { name: 'me' })
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
  @Mutation(() => UserGraphQLObject, { name: 'updateUser' })
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
  protected async getUserFullName(@Parent() user: UserGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching user full name',
    })

    return this.core.user.buildUserFullName(user)
  }
}
