import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { UserGraphQLObject } from '@interface/adapters/graphql/objects/user.object'
import { UserFiltersRequest } from '@interface/adapters/graphql/requests/user/user-filters.request'
import { UsersGraphQLResponse } from '@interface/adapters/graphql/responses/users.response'
import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import AuthzService from 'src/app/authz/service'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import { KeyResultCheckInObject } from 'src/app/graphql/key-result/check-in/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import { TeamObject } from 'src/app/graphql/team/models'
import DomainService from 'src/domain/service'
import { UserDTO } from 'src/domain/user/dto'
import { User } from 'src/domain/user/entities'

import { BaseGraphQLResolver } from './base.resolver'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => UserGraphQLObject)
export class UserGraphQLResolver extends BaseGraphQLResolver<User, UserDTO> {
  private readonly logger = new Logger(UserGraphQLResolver.name)

  constructor(
    protected readonly domain: DomainService,
    protected readonly authzService: AuthzService,
  ) {
    super(RESOURCE.USER, domain, domain.user, authzService)
  }

  @Permissions(PERMISSION['USER:READ'])
  @Query(() => UsersGraphQLResponse, { name: 'users' })
  protected async getUsers(
    @Args() filters: UserFiltersRequest,
    @GraphQLUser() authzUser: AuthzUser,
  ) {
    this.logger.log({
      filters,
      message: 'Fetching user with filters',
    })

    const user = await this.getOneWithActionScopeConstraint(filters, authzUser)
    if (!user) throw new UserInputError('We could not found an user with provided filters')

    return user
  }

  // @Permissions(PERMISSION['USER:READ'])
  // @Query(() => UserGraphQLResponse, { name: 'me' })
  // protected async getMyUser(@GraphQLUser() authzUser: AuthzUser) {
  //   const { id } = authzUser
  //   this.logger.log(
  //     `Fetching data about the user that is executing the request. Provided user ID: ${id.toString()}`,
  //   )

  //   const user = await this.getOneWithActionScopeConstraint({ id }, authzUser)
  //   if (!user) throw new UserInputError(`We could not found an user with ID ${id}`)

  //   return user
  // }

  // @Permissions(PERMISSION['USER:UPDATE'])
  // @Mutation(() => UserGraphQLResponse, { name: 'updateUser' })
  // protected async updateUser(
  //   @GraphQLUser() authzUser: AuthzUser,
  //   @Args() request: UserUpdateRequest,
  // ) {
  //   this.logger.log({
  //     authzUser,
  //     request,
  //     message: 'Received update user request',
  //   })

  //   const user = await this.updateWithActionScopeConstraint(
  //     { id: request.id },
  //     request.data,
  //     authzUser,
  //   )
  //   if (!user) throw new UserInputError(`We could not found an user with ID ${request.id}`)

  //   return user
  // }

  @ResolveField('fullName', () => String)
  protected async getUserFullName(@Parent() user: UserGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching user full name',
    })

    return this.domain.user.buildUserFullName(user)
  }

  @ResolveField('companies', () => [TeamObject], { nullable: true })
  protected async getUserCompanies(
    @Parent() user: UserGraphQLObject,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    this.logger.log({
      user,
      message: 'Fetching companies for user',
    })

    const companies = await this.domain.team.getUserCompanies(user)
    const companiesWithLimit = limit ? companies.slice(0, limit) : companies

    return companiesWithLimit
  }

  @ResolveField('teams', () => [TeamObject], { nullable: true })
  protected async getUserTeams(@Parent() user: UserGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching teams for user',
    })

    const teams = await this.domain.team.getWithUser(user)

    return teams
  }

  @ResolveField('ownedTeams', () => [TeamObject], { nullable: true })
  protected async getUserOwnedTeams(@Parent() user: UserGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching owned teams for user',
    })

    return this.domain.team.getFromOwner(user)
  }

  @ResolveField('objectives', () => [ObjectiveObject], { nullable: true })
  protected async UserGraphQLResponse(@Parent() user: UserGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching objectives for user',
    })

    return this.domain.objective.getFromOwner(user)
  }

  @ResolveField('keyResults', () => [KeyResultObject], { nullable: true })
  protected async getUserKeyResults(@Parent() user: UserGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching key results for user',
    })

    return this.domain.keyResult.getFromOwner(user)
  }

  @ResolveField('keyResultCheckIns', () => [KeyResultCheckInObject], { nullable: true })
  protected async getUserKeyResultCheckIns(@Parent() user: UserGraphQLObject) {
    this.logger.log({
      user,
      message: 'Fetching check-ins by user',
    })

    return this.domain.keyResult.getCheckInsByUser(user)
  }
}
