import { Parent, ResolveField } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'

import { UserKeyResultsGraphQLConnection } from './user-key-results.connection'

@GuardedResolver(UserKeyResultsGraphQLConnection)
export class UserKeyResultsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResult,
  KeyResultInterface
> {
  constructor(
    protected readonly core: CoreProvider,
    private readonly corePorts: CorePortsProvider,
  ) {
    super(Resource.KEY_RESULT, core, core.keyResult)
  }

  @ResolveField('quarterlyProgress', () => Number)
  protected async getKeyResultsQuarterlyProgress(
    @RequestUserWithContext() userWithContext: UserWithContext,
    @Parent() { parentNodeId }: ConnectionRelayGraphQLInterface<KeyResult>,
  ) {
    const progress = await this.corePorts.dispatchCommand<number>(
      'get-user-quarterly-progress',
      parentNodeId,
    )

    return progress
  }

  @ResolveField('yearlyProgress', () => Number)
  protected async getKeyResultsYearlyProgress(
    @RequestUserWithContext() userWithContext: UserWithContext,
    @Parent() { parentNodeId }: ConnectionRelayGraphQLInterface<KeyResult>,
  ) {
    const progress = await this.corePorts.dispatchCommand<number>(
      'get-user-yearly-progress',
      parentNodeId,
    )

    return progress
  }
}
