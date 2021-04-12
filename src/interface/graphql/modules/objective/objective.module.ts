import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { ObjectiveGraphQLResolver } from './resolvers/objective.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule],
  providers: [ObjectiveGraphQLResolver],
})
export class ObjectiveGraphQLModule {}
