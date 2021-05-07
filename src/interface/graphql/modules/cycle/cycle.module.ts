import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { AmplitudeModule } from '@infrastructure/amplitude/amplitude.module'

import { CycleCyclesConnectionGraphQLResolver } from './connections/cycle-cycles/cycle-cycles.resolver'
import { CycleKeyResultsConnectionGraphQLResolver } from './connections/cycle-key-results/cycle-key-results.resolver'
import { CyclesConnectionGraphQLResolver } from './connections/cycles/cycles.resolver'
import { CycleGraphQLResolver } from './cycle.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule, AmplitudeModule],
  providers: [
    CycleGraphQLResolver,
    CyclesConnectionGraphQLResolver,
    CycleCyclesConnectionGraphQLResolver,
    CycleKeyResultsConnectionGraphQLResolver,
  ],
})
export class CycleGraphQLModule {}
