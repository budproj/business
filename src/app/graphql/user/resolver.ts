import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { GraphQLUser, Permissions } from 'src/app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'src/app/authz/guards'
import { EnhanceWithBudUser } from 'src/app/authz/interceptors'
import { AuthzUser } from 'src/app/authz/types'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import DomainService from 'src/domain/service'
import { UserDTO } from 'src/domain/user/dto'
import { User } from 'src/domain/user/entities'
import DomainUserService from 'src/domain/user/service'

import { UserObject } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => UserObject)
class GraphQLUserResolver extends GraphQLEntityResolver<User, UserDTO> {
  private readonly logger = new Logger(GraphQLUserResolver.name)

  constructor(protected readonly domain: DomainService) {
    super(RESOURCE.USER, domain, domain.user)
  }

  @Permissions(PERMISSION['USER:READ'])
  @Query(() => UserObject)
  async user(
    @Args('id', { type: () => ID }) id: UserObject['id'],
    @GraphQLUser() authzUser: AuthzUser,
  ) {
    this.logger.log(`Fetching user with id ${id.toString()}`)

    const user = await this.getOneWithActionScopeConstraint({ id }, authzUser)
    if (!user) throw new NotFoundException(`We could not found an user with id ${id}`)

    return user
  }

  // @Permissions(PERMISSION['USER:READ'])
  // @Query(() => UserObject)
  // async me(@GraphQLUser() authzUser: AuthzUser) {
  //   const { id } = authzUser
  //   this.logger.log(
  //     `Fetching data about the user that is executing the request. Provided user ID: ${id.toString()}`,
  //   )
  //
  //   const user = await this.resolverService.getOneWithActionScopeConstraint({ id }, authzUser)
  //   if (!user) throw new NotFoundException(`We could not found an user with ID ${id}`)
  //
  //   return user
  // }
  //
  // @ResolveField()
  // async keyResults(@Parent() user: UserObject) {
  //   this.logger.log({
  //     user,
  //     message: 'Fetching key results for user',
  //   })
  //
  //   return this.keyResultDomain.getFromOwner(user.id)
  // }
  //
  // @ResolveField()
  // async objectives(@Parent() user: UserObject) {
  //   this.logger.log({
  //     user,
  //     message: 'Fetching objectives for user',
  //   })
  //
  //   return this.objectiveDomain.getFromOwner(user.id)
  // }
  //
  // @ResolveField()
  // async progressReports(@Parent() user: UserObject) {
  //   this.logger.log({
  //     user,
  //     message: 'Fetching progress reports for user',
  //   })
  //
  //   return this.keyResultDomain.report.progress.getFromUser(user.id)
  // }
  //
  // @ResolveField()
  // async confidenceReports(@Parent() user: UserObject) {
  //   this.logger.log({
  //     user,
  //     message: 'Fetching confidence reports for user',
  //   })
  //
  //   return this.keyResultDomain.report.confidence.getFromUser(user.id)
  // }
  //
  // @ResolveField()
  // async ownedTeams(@Parent() user: UserObject) {
  //   this.logger.log({
  //     user,
  //     message: 'Fetching owned teams for user',
  //   })
  //
  //   return this.teamDomain.getFromOwner(user.id)
  // }
  //
  // @ResolveField()
  // async companies(
  //   @Parent() user: UserObject,
  //   @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  // ) {
  //   this.logger.log({
  //     user,
  //     message: 'Fetching companies for user',
  //   })
  //
  //   const companies = await this.teamDomain.getUserRootTeams(user)
  //   const companiesWithLimit = limit ? companies.slice(0, limit) : companies
  //
  //   return companiesWithLimit
  // }
  //
  // @ResolveField()
  // async fullName(@Parent() user: UserObject) {
  //   this.logger.log({
  //     user,
  //     message: 'Fetching user full name',
  //   })
  //
  //   return this.resolverService.getUserFullName(user)
  // }
}

export default GraphQLUserResolver
