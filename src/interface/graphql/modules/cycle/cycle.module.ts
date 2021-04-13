import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { CycleCyclesConnectionGraphQLResolver } from './connections/cycle-cycles/cycle-cycles.resolver'
import { CyclesConnectionGraphQLResolver } from './connections/cycles/cycles.resolver'
import { CycleGraphQLResolver } from './cycle.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule],
  providers: [
    CycleGraphQLResolver,
    CyclesConnectionGraphQLResolver,
    CycleCyclesConnectionGraphQLResolver,
  ],
})
export class CycleGraphQLModule {}
