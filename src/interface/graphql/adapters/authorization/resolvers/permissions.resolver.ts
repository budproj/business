import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'
import { camelCase, mapKeys } from 'lodash'

import { Effect } from '@adapters/policy/enums/effect.enum'
import { Scope } from '@adapters/policy/enums/scope.enum'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { CommandStatement } from '@adapters/policy/types/command-statement.type'
import { ResourceStatement } from '@adapters/policy/types/resource-statement.type copy'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { Cacheable } from "@lib/cache/cacheable.decorator";

import { RequestUserWithContext } from '../../context/decorators/request-user-with-context.decorator'
import { GuardedQuery } from '../decorators/guarded-query.decorator'
import { GuardedResolver } from '../decorators/guarded-resolver.decorator'
import { ScopeGraphQLEnum } from '../enums/scope.enum'
import { PermissionsGraphQLObject } from '../objects/permissions.object'

@GuardedResolver(PermissionsGraphQLObject)
export class PermissionsGraphQLResolver {
  private readonly authz = new PolicyAdapter()

  @Cacheable((scope, user) => [user.id, scope], 15 * 60)
  @GuardedQuery(PermissionsGraphQLObject, 'permission:read', { name: 'permissions' })
  protected getUserPermissionsForScope(
    @Args('scope', { type: () => ScopeGraphQLEnum, defaultValue: Scope.COMPANY })
    scope: Scope,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {

    const resourcePolicy = this.authz.getResourcePolicyFromPermissions(
      userWithContext.token.permissions,
    )
    const resourcesCommandStatement = this.authz.getResourcesCommandStatementsForScopeFromPolicy(
      resourcePolicy,
      scope,
    )

    return this.normalizeResourceStatementKeys<CommandStatement>(resourcesCommandStatement)
  }

  private normalizeResourceStatementKeys<E = Effect>(
    statement: ResourceStatement<E>,
  ): PermissionsGraphQLObject {
    return mapKeys<ResourceStatement<E>, PermissionsGraphQLObject>(statement, (_, key) =>
      camelCase(key),
    )
  }
}
