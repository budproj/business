import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'

import { TeamCyclesGraphQLConnection } from './team-cycles.connection'

@GuardedResolver(TeamCyclesGraphQLConnection)
export class TeamCyclesConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Cycle,
  CycleInterface
> {
  constructor(protected readonly core: CoreProvider) {
    super(Resource.CYCLE, core, core.cycle)
  }
}
