import { Resolver } from '@nestjs/graphql'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { QueryGuardAdapter } from '@adapters/authorization/query-guard.adapter'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreEntityInterface } from '@core/core-entity.interface'
import { CoreEntity } from '@core/core.orm-entity'
import { CoreProvider } from '@core/core.provider'
import { CoreEntityProvider } from '@core/entity.provider'
import { BaseGraphQLResolver } from '@interface/graphql/resolvers/base.resolver'

import { GuardedConnectionGraphQLInterface } from '../interfaces/guarded-connection.interface'

@Resolver(() => GuardedConnectionGraphQLInterface)
export abstract class GuardedConnectionGraphQLResolver<
  E extends CoreEntity,
  I extends CoreEntityInterface
> extends BaseGraphQLResolver {
  protected readonly queryGuard: QueryGuardAdapter<E, I>
  protected readonly accessControl?: AccessControl
  protected readonly policyAdapter = new PolicyAdapter()

  protected constructor(
    protected readonly resource: Resource,
    protected readonly core: CoreProvider,
    coreEntityProvider: CoreEntityProvider<E, I>,
  ) {
    super()

    this.queryGuard = new QueryGuardAdapter(resource, core, coreEntityProvider)
  }

  protected async getConnectionPolicyForUserWithArgs(
    userWithContext: UserWithContext,
    ...indexArguments: string[]
  ) {
    const canCreate = await this.accessControl.canRead(userWithContext, ...indexArguments)

    return {
      create: this.policyAdapter.getEffectForBoolean(canCreate),
    }
  }
}
