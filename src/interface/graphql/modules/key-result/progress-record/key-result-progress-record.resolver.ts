import { Logger } from '@nestjs/common'
import { Context, Parent, ResolveField } from '@nestjs/graphql'

import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { IDataloaders } from '@interface/graphql/dataloader/dataloader.service'
import { BaseGraphQLResolver } from '@interface/graphql/resolvers/base.resolver'

import { KeyResultCheckInGraphQLNode } from '../check-in/key-result-check-in.node'
import { KeyResultGraphQLNode } from '../key-result.node'

import { KeyResultProgressRecordGraphQLNode } from './key-result-progress-record.node'

@GuardedResolver(KeyResultProgressRecordGraphQLNode)
export class KeyResultProgressRecordGraphQLResolver extends BaseGraphQLResolver {
  private readonly logger = new Logger(KeyResultProgressRecordGraphQLResolver.name)

  constructor(private readonly corePorts: CorePortsProvider) {
    super()
  }

  @ResolveField('keyResult', () => KeyResultGraphQLNode)
  protected async resolveKeyResultForKeyResultProgressRecord(
    @Parent() keyResultProgressRecord: KeyResultProgressRecordGraphQLNode,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    this.logger.log({
      keyResultProgressRecord,
      message: 'Fetching key result for key result progress record',
    })

    return loaders.keyResult.load(keyResultProgressRecord.keyResultId)
  }

  @ResolveField('keyResultCheckIn', () => KeyResultCheckInGraphQLNode)
  protected async resolveKeyResultCheckInForKeyResultProgressRecord(
    @Parent() keyResultProgressRecord: KeyResultProgressRecordGraphQLNode,
  ) {
    this.logger.log({
      keyResultProgressRecord,
      message: 'Fetching key result check-in for key result progress record',
    })

    return this.corePorts.dispatchCommand<KeyResultCheckIn>('get-key-result-check-in', {
      id: keyResultProgressRecord.keyResultCheckInId,
    })
  }
}
