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
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { GraphQLUser } from '@interface/graphql/decorators/graphql-user'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/objects/key-result/check-in/key-result-check-in.node'
import { KeyResultGraphQLNode } from '@interface/graphql/objects/key-result/key-result.node'
import { ObjectiveGraphQLNode } from '@interface/graphql/objects/objective/objective.node'
import { TeamGraphQLNode } from '@interface/graphql/objects/team/team.node'
import { UserGraphQLNode } from '@interface/graphql/objects/user/user.node'
import { NourishUserDataInterceptor } from '@interface/graphql/resolvers/interceptors/nourish-user-data.interceptor'

import { UserFiltersRequest } from '../requests/user-filters.request'
import { UserUpdateRequest } from '../requests/user-update.request'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => UserGraphQLNode)
export class UserGraphQLResolver extends GuardedNodeGraphQLResolver<User, UserInterface> {
  private readonly logger = new Logger(UserGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.USER, core, core.user)
  }

  @RequiredActions('user:read')
  @Query(() => UserGraphQLNode, { name: 'me' })
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
  @Mutation(() => UserGraphQLNode, { name: 'updateUser' })
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
  protected async getUserFullName(@Parent() user: UserGraphQLNode) {
    this.logger.log({
      user,
      message: 'Fetching user full name',
    })

    return this.core.user.buildUserFullName(user)
  }

  @ResolveField('companies', () => [TeamGraphQLNode], { nullable: true })
  protected async getUserCompanies(
    @Parent() user: UserGraphQLNode,
    @Args() request?: UserFiltersRequest,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching companies for user',
    })

    const queryOptions: GetOptions<Team> = {
      limit: request.first,
    }
    const companies = await this.core.team.getUserCompanies(user, undefined, queryOptions)

    return companies
  }

  @ResolveField('teams', () => [TeamGraphQLNode], { nullable: true })
  protected async getUserTeams(@Parent() user: UserGraphQLNode) {
    this.logger.log({
      user,
      message: 'Fetching teams for user',
    })

    const teams = await this.core.team.getWithUser(user)

    return teams
  }

  @ResolveField('ownedTeams', () => [TeamGraphQLNode], { nullable: true })
  protected async getUserOwnedTeams(@Parent() user: UserGraphQLNode) {
    this.logger.log({
      user,
      message: 'Fetching owned teams for user',
    })

    return this.core.team.getFromOwner(user)
  }

  @ResolveField('objectives', () => [ObjectiveGraphQLNode], { nullable: true })
  protected async getUserObjectives(@Parent() user: UserGraphQLNode) {
    this.logger.log({
      user,
      message: 'Fetching objectives for user',
    })

    return this.core.objective.getFromOwner(user)
  }

  @ResolveField('keyResults', () => [KeyResultGraphQLNode], { nullable: true })
  protected async getUserKeyResults(@Parent() user: UserGraphQLNode) {
    this.logger.log({
      user,
      message: 'Fetching key results for user',
    })

    return this.core.keyResult.getFromOwner(user)
  }

  @ResolveField('keyResultCheckIns', () => [KeyResultCheckInGraphQLNode], { nullable: true })
  protected async getUserKeyResultCheckIns(@Parent() user: UserGraphQLNode) {
    this.logger.log({
      user,
      message: 'Fetching check-ins by user',
    })

    return this.core.keyResult.getCheckInsByUser(user)
  }
}
