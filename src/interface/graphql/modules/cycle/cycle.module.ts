import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'

import { CycleGraphQLResolver } from './resolvers/cycle.resolver'

@Module({
  imports: [CoreModule],
  providers: [CycleGraphQLResolver],
})
export class CycleGraphQLModule {}
