import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { KeyResultInterface } from '@core/modules/key-result/key-result.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/modules/check-in/key-result-check-in.interface'
import { KeyResultCommentInterface } from '@core/modules/key-result/modules/comment/key-result-comment.interface'
import { ObjectiveInterface } from '@core/modules/objective/objective.interface'
import { TeamInterface } from '@core/modules/team/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user'
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { UserKeyResultCheckInsGraphQLConnection } from '@interface/graphql/objects/user/user-key-result-check-ins.connection'
import { UserKeyResultCommentsGraphQLConnection } from '@interface/graphql/objects/user/user-key-result-comments.connection'
import { UserKeyResultsGraphQLConnection } from '@interface/graphql/objects/user/user-key-results.connection'
import { UserObjectivesGraphQLConnection } from '@interface/graphql/objects/user/user-objectives.connection'
import { UserTeamsGraphQLConnection } from '@interface/graphql/objects/user/user-teams.connection'
import { UserGraphQLNode } from '@interface/graphql/objects/user/user.node'
import { NourishUserDataInterceptor } from '@interface/graphql/resolvers/interceptors/nourish-user-data.interceptor'

import { KeyResultCheckInFiltersRequest } from '../../key-result/modules/check-in/requests/key-result-check-in-filters.request'
import { KeyResultCommentFiltersRequest } from '../../key-result/modules/comment/requests/key-result-comment-filters.request'
import { KeyResultFiltersRequest } from '../../key-result/requests/key-result-filters.request'
import { ObjectiveFiltersRequest } from '../../objective/requests/objective-filters.request'
import { TeamFiltersRequest } from '../../team/requests/team-filters.request'
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
  protected async getMyUser(@AuthorizedRequestUser() authorizedRequestUser: AuthorizationUser) {
    this.logger.log(
      `Fetching data about the user that is executing the request. Provided user ID: ${authorizedRequestUser.id}`,
    )

    const user = await this.queryGuard.getOneWithActionScopeConstraint(
      { id: authorizedRequestUser.id },
      authorizedRequestUser,
    )
    if (!user)
      throw new UserInputError(`We could not found an user with ID ${authorizedRequestUser.id}`)

    return user
  }

  @RequiredActions('user:update')
  @Mutation(() => UserGraphQLNode, { name: 'updateUser' })
  protected async updateUser(
    @AuthorizedRequestUser() authorizedRequestUser: AuthorizationUser,
    @Args() request: UserUpdateRequest,
  ) {
    this.logger.log({
      authorizedRequestUser,
      request,
      message: 'Received update user request',
    })

    const user = await this.queryGuard.updateWithActionScopeConstraint(
      { id: request.id },
      request.data,
      authorizedRequestUser,
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

  @ResolveField('companies', () => UserTeamsGraphQLConnection, { nullable: true })
  protected async getUserCompanies(
    @Parent() user: UserGraphQLNode,
    @Args() request?: TeamFiltersRequest,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching companies for user',
    })

    const [connection, filters] = this.relay.unmarshalRequest(request)

    const queryOptions: GetOptions<Team> = {
      limit: connection.first,
    }
    const queryResult = await this.core.team.getUserCompanies(user, filters, queryOptions)

    return this.relay.marshalResponse<Team>(queryResult, connection)
  }

  @ResolveField('teams', () => UserTeamsGraphQLConnection, { nullable: true })
  protected async getUserTeams(
    @Parent() user: UserGraphQLNode,
    @Args() request?: TeamFiltersRequest,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching teams for user',
    })

    const [connection, filters] = this.relay.unmarshalRequest(request)

    const queryOptions: GetOptions<Team> = {
      limit: connection.first,
    }
    const queryResult = await this.core.user.getUserTeams(user, filters, queryOptions)

    return this.relay.marshalResponse<TeamInterface>(queryResult, connection)
  }

  @ResolveField('ownedTeams', () => UserTeamsGraphQLConnection, { nullable: true })
  protected async getUserOwnedTeams(
    @Parent() user: UserGraphQLNode,
    @Args() request?: TeamFiltersRequest,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching owned teams for user',
    })

    const [connection, filters] = this.relay.unmarshalRequest(request)

    const queryOptions: GetOptions<Team> = {
      limit: connection.first,
    }
    const queryResult = await this.core.team.getFromOwner(user, filters, queryOptions)

    return this.relay.marshalResponse<TeamInterface>(queryResult, connection)
  }

  @ResolveField('objectives', () => UserObjectivesGraphQLConnection, { nullable: true })
  protected async getUserObjectives(
    @Parent() user: UserGraphQLNode,
    @Args() request?: ObjectiveFiltersRequest,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching objectives for user',
    })

    const [connection, filters] = this.relay.unmarshalRequest(request)

    const queryOptions: GetOptions<Team> = {
      limit: connection.first,
    }
    const queryResult = await this.core.objective.getFromOwner(user, filters, queryOptions)

    return this.relay.marshalResponse<ObjectiveInterface>(queryResult, connection)
  }

  @ResolveField('keyResults', () => UserKeyResultsGraphQLConnection, { nullable: true })
  protected async getUserKeyResults(
    @Parent() user: UserGraphQLNode,
    @Args() request?: KeyResultFiltersRequest,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching key results for user',
    })

    const [connection, filters] = this.relay.unmarshalRequest(request)

    const queryOptions: GetOptions<Team> = {
      limit: connection.first,
    }
    const queryResult = await this.core.keyResult.getFromOwner(user, filters, queryOptions)

    return this.relay.marshalResponse<KeyResultInterface>(queryResult, connection)
  }

  @ResolveField('keyResultComments', () => UserKeyResultCommentsGraphQLConnection, {
    nullable: true,
  })
  protected async getUserKeyResultComments(
    @Parent() user: UserGraphQLNode,
    @Args() request?: KeyResultCommentFiltersRequest,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching comments by user',
    })

    const [connection, filters] = this.relay.unmarshalRequest(request)

    const queryOptions: GetOptions<Team> = {
      limit: connection.first,
    }
    const queryResult = await this.core.keyResult.getCommentsCreatedByUser(
      user,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResultCommentInterface>(queryResult, connection)
  }

  @ResolveField('keyResultCheckIns', () => UserKeyResultCheckInsGraphQLConnection, {
    nullable: true,
  })
  protected async getUserKeyResultCheckIns(
    @Parent() user: UserGraphQLNode,
    @Args() request?: KeyResultCheckInFiltersRequest,
  ) {
    this.logger.log({
      user,
      request,
      message: 'Fetching check-ins by user',
    })

    const [connection, filters] = this.relay.unmarshalRequest(request)

    const queryOptions: GetOptions<Team> = {
      limit: connection.first,
    }
    const queryResult = await this.core.keyResult.getCheckInsCreatedByUser(
      user,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResultCheckInInterface>(queryResult, connection)
  }
}
