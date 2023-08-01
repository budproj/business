import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { MissionControlModule } from '@core/modules/mission-control/mission-control.module'

import { CycleAccessControl } from './access-control/cycle.access-control'
import { CycleCyclesConnectionGraphQLResolver } from './connections/cycle-cycles/cycle-cycles.resolver'
import { CycleKeyResultsConnectionGraphQLResolver } from './connections/cycle-key-results/cycle-key-results.resolver'
import { CyclesConnectionGraphQLResolver } from './connections/cycles/cycles.resolver'
import { CycleGraphQLResolver } from './cycle.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule, MissionControlModule],
  providers: [
    CycleGraphQLResolver,
    CyclesConnectionGraphQLResolver,
    CycleCyclesConnectionGraphQLResolver,
    CycleKeyResultsConnectionGraphQLResolver,
    CycleAccessControl,
  ],
})
export class CycleGraphQLModule {}
