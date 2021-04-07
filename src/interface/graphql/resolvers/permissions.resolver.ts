import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { Scope } from '@adapters/authorization/enums/scope.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { PermissionsGraphQLObject } from '@interface/graphql/objects/permissions.object'

import { ScopeGraphQLEnum } from '../enums/scope.enum'

import { GraphQLUser } from './decorators/graphql-user'
import { GraphQLRequiredPoliciesGuard } from './guards/required-policies.guard'
import { GraphQLTokenGuard } from './guards/token.guard'
import { NourishUserDataInterceptor } from './interceptors/nourish-user-data.interceptor'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => PermissionsGraphQLObject)
export class PermissionsGraphQLResolver {
  private readonly logger = new Logger(PermissionsGraphQLResolver.name)
  private readonly authz = new AuthzAdapter()

  @RequiredActions('permission:read')
  @Query(() => PermissionsGraphQLObject, { name: 'permissions' })
  protected getUserPermissionsForScope(
    @Args('scope', { type: () => ScopeGraphQLEnum, defaultValue: Scope.COMPANY })
    scope: Scope,
    @GraphQLUser() graphqlUser: AuthorizationUser,
  ) {
    this.logger.log(`Fetching user permissions for user with ID ${graphqlUser.id}`)

    // Const permissions = this.authz.getUserPoliciesForConstraint(graphqlUser, constraint)
    // const normalizedPermissions = mapKeys(permissions, (_, snakeCasedResource: RESOURCE) =>
    //   camelCase(snakeCasedResource),
    // )

    return {}
  }
}
