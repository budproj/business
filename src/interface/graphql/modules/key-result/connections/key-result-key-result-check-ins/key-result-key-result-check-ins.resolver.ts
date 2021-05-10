import { Parent, ResolveField } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { KeyResultCheckInAccessControl } from '@interface/graphql/modules/key-result/check-in/key-result-check-in.access-control'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/modules/key-result/check-in/key-result-check-in.node'

import { KeyResultKeyResultCheckInsGraphQLConnection } from './key-result-key-result-check-ins.connection'

@GuardedResolver(KeyResultKeyResultCheckInsGraphQLConnection)
export class KeyResultKeyResultCheckInsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResultCheckIn,
  KeyResultCheckInInterface
> {
  constructor(
    protected readonly core: CoreProvider,
    protected readonly accessControl: KeyResultCheckInAccessControl,
  ) {
    super(Resource.KEY_RESULT_CHECK_IN, core, core.keyResult.keyResultCheckInProvider)
  }

  @ResolveField('policy', () => ConnectionPolicyGraphQLObject)
  protected async resolveNodePolicy(
    @Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    return this.getConnectionPolicyForUserWithArgs(userWithContext, keyResultCheckIn.id)
  }
}
