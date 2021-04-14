import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'
import { camelCase, mapKeys } from 'lodash'

import { AuthzAdapter } from '@adapters/authorization/authz.adapter'
import { Effect } from '@adapters/authorization/enums/effect.enum'
import { Scope } from '@adapters/authorization/enums/scope.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CommandStatement } from '@adapters/authorization/types/command-statement.type'
import { ResourceStatement } from '@adapters/authorization/types/resource-statement.type copy'

import { AuthorizedRequestUser } from '../decorators/authorized-request-user.decorator'
import { GuardedQuery } from '../decorators/guarded-query.decorator'
import { GuardedResolver } from '../decorators/guarded-resolver.decorator'
import { ScopeGraphQLEnum } from '../enums/scope.enum'
import { PermissionsGraphQLObject } from '../objects/permissions.object'

@GuardedResolver(PermissionsGraphQLObject)
export class PermissionsGraphQLResolver {
  private readonly logger = new Logger(PermissionsGraphQLResolver.name)
  private readonly authz = new AuthzAdapter()

  @GuardedQuery(PermissionsGraphQLObject, 'permission:read', { name: 'permissions' })
  protected getUserPermissionsForScope(
    @Args('scope', { type: () => ScopeGraphQLEnum, defaultValue: Scope.COMPANY })
    scope: Scope,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log(`Fetching user permissions for user with ID ${authorizationUser.id}`)

    const resourcePolicy = this.authz.getResourcePolicyFromPermissions(
      authorizationUser.token.permissions,
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
