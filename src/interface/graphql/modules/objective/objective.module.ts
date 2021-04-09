import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'

import { ObjectiveGraphQLResolver } from './resolvers/objective.resolver'

@Module({
  imports: [CoreModule],
  providers: [ObjectiveGraphQLResolver],
})
export class ObjectiveGraphQLModule {}
