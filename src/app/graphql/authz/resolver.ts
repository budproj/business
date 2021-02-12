import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'
import { camelCase, mapKeys } from 'lodash'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import AuthzService from 'src/app/authz/service'
import { AuthzUser } from 'src/app/authz/types'
import { CONSTRAINT } from 'src/domain/constants'

import { GraphQLUser } from './decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from './guards'
import { EnhanceWithBudUser } from './interceptors'
import { PermissionsObject } from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => PermissionsObject)
export class GraphQLPermissionsResolver {
  private readonly logger = new Logger(GraphQLPermissionsResolver.name)

  constructor(protected readonly authzService: AuthzService) {}

  @Permissions(PERMISSION['PERMISSION:READ'])
  @Query(() => PermissionsObject, { name: 'permissions' })
  protected getUserPermissionsForScope(
    @Args('constraint', { type: () => CONSTRAINT, defaultValue: CONSTRAINT.COMPANY })
    constraint: CONSTRAINT,
    @GraphQLUser() authzUser: AuthzUser,
  ) {
    this.logger.log(`Fetching user permissions for user with ID ${authzUser.id}`)

    const permissions = this.authzService.getUserPermissionsForScope(authzUser, constraint)
    const normalizedPermissions = mapKeys(permissions, (_, snakeCasedResource: RESOURCE) =>
      camelCase(snakeCasedResource),
    )

    return normalizedPermissions
  }
}
