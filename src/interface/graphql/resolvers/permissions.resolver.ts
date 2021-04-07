import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { Scope } from '@adapters/authorization/enums/scope.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { ScopeGraphQLEnum } from '@interface/graphql/enums/scope.enum'
import { PermissionsGraphQLObject } from '@interface/graphql/responses/permissions.response'

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

    const resourcePolicy = this.authz.getResourcePolicyFromPermissions(
      graphqlUser.token.permissions,
    )
    const resourcesCommandStatement = this.authz.getResourcesCommandStatementsForScopeFromPolicy(
      resourcePolicy,
      scope,
    )

    console.log(resourcesCommandStatement)

    return {}
  }
}
