import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { ObjectiveKeyResultsConnectionGraphQLResolver } from '@interface/graphql/modules/objective/connections/objective-key-results/objective-key-results.resolver'
import { ObjectiveTeamsGraphQLConnection } from '@interface/graphql/modules/objective/connections/objective-teams/objective-teams.connection'

import { ObjectiveBaseAccessControl } from './access-control/base.access-control'
import { ObjectivesConnectionGraphQLResolver } from './connections/objectives/objectives.resolver'
import { ObjectiveGraphQLResolver } from './objective.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule],
  providers: [
    ObjectiveGraphQLResolver,
    ObjectivesConnectionGraphQLResolver,
    ObjectiveKeyResultsConnectionGraphQLResolver,
    ObjectiveTeamsGraphQLConnection,
    ObjectiveBaseAccessControl,
  ],
  exports: [ObjectiveBaseAccessControl],
})
export class ObjectiveGraphQLModule {}
