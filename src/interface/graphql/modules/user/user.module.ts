import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { AWSModule } from '@infrastructure/aws/aws.module'
import { UserSettingGraphQLResolver } from '@interface/graphql/modules/user/setting/user-setting.resolver'
import { UserAccessControl } from '@interface/graphql/modules/user/user.access-control'

import { UserKeyResultCommentsConnectionGraphQLResolver } from './connections/user-key-result-comments/user-key-result-comments.resolver'
import { UserKeyResultsConnectionGraphQLResolver } from './connections/user-key-results/user-key-results.resolver'
import { UserObjectivesConnectionGraphQLResolver } from './connections/user-objectives/user-objectives.resolver'
import { UserTeamsConnectionGraphQLResolver } from './connections/user-teams/user-teams.resolver'
import { UsersConnectionGraphQLResolver } from './connections/users/users.resolver'
import { TaskGraphQLResolver } from './task/task.resolver'
import { UserGraphQLResolver } from './user.resolver'

@Module({
  imports: [CoreModule, AWSModule, GraphQLConfigModule],
  providers: [
    UserGraphQLResolver,
    TaskGraphQLResolver,
    UserSettingGraphQLResolver,
    UsersConnectionGraphQLResolver,
    UserTeamsConnectionGraphQLResolver,
    UserObjectivesConnectionGraphQLResolver,
    UserKeyResultsConnectionGraphQLResolver,
    UserKeyResultCommentsConnectionGraphQLResolver,
    UserAccessControl,
  ],
  exports: [UserAccessControl],
})
export class UserGraphQLModule {}
