import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import AuthzService from 'src/app/authz/service'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import { KeyResultCheckInObject } from 'src/app/graphql/key-result/check-in/models'
import { KeyResultCustomListObject } from 'src/app/graphql/key-result/custom-list/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { TeamObject } from 'src/app/graphql/team/models'
import DomainService from 'src/domain/service'
import { UserDTO } from 'src/domain/user/dto'
import { User } from 'src/domain/user/entities'

import { UserObject } from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => UserObject)
class GraphQLUserResolver extends GraphQLEntityResolver<User, UserDTO> {
  private readonly logger = new Logger(GraphQLUserResolver.name)

  constructor(
    protected readonly domain: DomainService,
    protected readonly authzService: AuthzService,
  ) {
    super(RESOURCE.USER, domain, domain.user, authzService)
  }

  @Permissions(PERMISSION['USER:READ'])
  @Query(() => UserObject, { name: 'user' })
  protected async getUser(
    @Args('id', { type: () => ID }) id: UserObject['id'],
    @GraphQLUser() authzUser: AuthzUser,
  ) {
    this.logger.log(`Fetching user with id ${id.toString()}`)

    const user = await this.getOneWithActionScopeConstraint({ id }, authzUser)
    if (!user) throw new UserInputError(`We could not found an user with id ${id}`)

    return user
  }

  @Permissions(PERMISSION['USER:READ'])
  @Query(() => UserObject, { name: 'me' })
  protected async getMyUser(@GraphQLUser() authzUser: AuthzUser) {
    const { id } = authzUser
    this.logger.log(
      `Fetching data about the user that is executing the request. Provided user ID: ${id.toString()}`,
    )

    const user = await this.getOneWithActionScopeConstraint({ id }, authzUser)
    if (!user) throw new UserInputError(`We could not found an user with ID ${id}`)

    return user
  }

  @ResolveField('fullName', () => String)
  protected async getUserFullName(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching user full name',
    })

    return this.domain.user.buildUserFullName(user)
  }

  @ResolveField('companies', () => [TeamObject], { nullable: true })
  protected async getUserCompanies(
    @Parent() user: UserObject,
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
  protected async getUserTeams(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching teams for user',
    })

    const teams = await this.domain.team.getWithUser(user)

    return teams
  }

  @ResolveField('ownedTeams', () => [TeamObject], { nullable: true })
  protected async getUserOwnedTeams(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching owned teams for user',
    })

    return this.domain.team.getFromOwner(user)
  }

  @ResolveField('objectives', () => [ObjectiveObject], { nullable: true })
  protected async getUserObjectives(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching objectives for user',
    })

    return this.domain.objective.getFromOwner(user)
  }

  @ResolveField('keyResults', () => [KeyResultObject], { nullable: true })
  protected async getUserKeyResults(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching key results for user',
    })

    return this.domain.keyResult.getFromOwner(user)
  }

  @ResolveField('keyResultCustomLists', () => [KeyResultCustomListObject], { nullable: true })
  protected async getUserKeyResultCustomLists(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching key result custom lists for user',
    })

    return this.domain.keyResult.getUserCustomLists(user)
  }

  @ResolveField('keyResultCheckIns', () => [KeyResultCheckInObject], { nullable: true })
  protected async getUserKeyResultCheckIns(@Parent() user: UserObject) {
    this.logger.log({
      user,
      message: 'Fetching check-ins by user',
    })

    return this.domain.keyResult.getCheckInsByUser(user)
  }
}

export default GraphQLUserResolver
