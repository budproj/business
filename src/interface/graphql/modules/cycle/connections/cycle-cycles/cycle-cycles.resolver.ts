import { Resource } from '@adapters/authorization/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-connection.resolver'

import { CycleGraphQLNode } from '../../cycle.node'

import { CycleCyclesGraphQLConnection } from './cycle-cycles.connection'

@GuardedResolver(CycleCyclesGraphQLConnection)
export class CycleCyclesConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Cycle,
  CycleInterface,
  CycleGraphQLNode
> {
  constructor(protected readonly core: CoreProvider) {
    super(Resource.CYCLE, core, core.cycle)
  }
}
