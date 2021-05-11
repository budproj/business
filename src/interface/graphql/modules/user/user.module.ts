import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { AmplitudeModule } from '@infrastructure/amplitude/amplitude.module'
import { AWSModule } from '@infrastructure/aws/aws.module'
import { UserAccessControl } from '@interface/graphql/modules/user/user.access-control'

import { UserKeyResultCommentsConnectionGraphQLResolver } from './connections/user-key-result-comments/user-key-result-comments.resolver'
import { UserKeyResultsConnectionGraphQLResolver } from './connections/user-key-results/user-key-results.resolver'
import { UserObjectivesConnectionGraphQLResolver } from './connections/user-objectives/user-objectives.resolver'
import { UserTeamsConnectionGraphQLResolver } from './connections/user-teams/user-teams.resolver'
import { UsersConnectionGraphQLResolver } from './connections/users/users.resolver'
import { UserGraphQLResolver } from './user.resolver'

@Module({
  imports: [CoreModule, AWSModule, GraphQLConfigModule, AmplitudeModule],
  providers: [
    UserGraphQLResolver,
    UsersConnectionGraphQLResolver,
    UserTeamsConnectionGraphQLResolver,
    UserObjectivesConnectionGraphQLResolver,
    UserKeyResultsConnectionGraphQLResolver,
    UserKeyResultCommentsConnectionGraphQLResolver,
    UserAccessControl,
  ],
})
export class UserGraphQLModule {}
