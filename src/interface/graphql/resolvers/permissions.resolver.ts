import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'
import { camelCase, mapKeys } from 'lodash'

import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { Effect } from '@adapters/authorization/enums/effect.enum'
import { Scope } from '@adapters/authorization/enums/scope.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CommandStatement } from '@adapters/authorization/types/command-statement.type'
import { ResourceStatement } from '@adapters/authorization/types/resource-statement.type copy'

import { ScopeGraphQLEnum } from '../enums/scope.enum'
import { PermissionsGraphQLObject } from '../objects/authorization/permissions.object'

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

    const permissions = this.normalizeResourceStatementKeys<CommandStatement>(
      resourcesCommandStatement,
    )

    return permissions
  }

  private normalizeResourceStatementKeys<E = Effect>(
    statement: ResourceStatement<E>,
  ): PermissionsGraphQLObject {
    return mapKeys<ResourceStatement<E>, PermissionsGraphQLObject>(statement, (_, key) =>
      camelCase(key),
    )
  }
}
