import { ResolveField, Resolver } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-errors'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { QueryGuardAdapter } from '@adapters/authorization/query-guard.adapter'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreEntityInterface } from '@core/core-entity.interface'
import { CoreEntity } from '@core/core.orm-entity'
import { CoreProvider } from '@core/core.provider'
import { CoreEntityProvider } from '@core/entity.provider'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { RelayConnection } from '@interface/graphql/adapters/relay/decorators/connection.decorator'
import { RelayGraphQLConnectionProvider } from '@interface/graphql/adapters/relay/providers/connection.provider'
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

  @ResolveField('policy', () => ConnectionPolicyGraphQLObject)
  protected async resolveNodePolicy(
    @RelayConnection() relayConnection: RelayGraphQLConnectionProvider,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    if (!relayConnection.parentNode) {
      throw new UserInputError('You cannot get the connection policy for root connections')
    }

    return this.getConnectionPolicyForUserWithArguments(
      userWithContext,
      relayConnection.parentNode.id,
    )
  }

  protected async getConnectionPolicyForUserWithArguments(
    userWithContext: UserWithContext,
    ...indexArguments: string[]
  ) {
    const canCreate = await this.accessControl.canCreate(userWithContext, ...indexArguments)

    return {
      create: this.policyAdapter.getEffectForBoolean(canCreate),
    }
  }
}
