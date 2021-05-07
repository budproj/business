import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { AmplitudeModule } from '@infrastructure/amplitude/amplitude.module'

import { ObjectivesConnectionGraphQLResolver } from './connections/objectives/objectives.resolver'
import { ObjectiveGraphQLResolver } from './objective.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule, AmplitudeModule],
  providers: [ObjectiveGraphQLResolver, ObjectivesConnectionGraphQLResolver],
})
export class ObjectiveGraphQLModule {}
