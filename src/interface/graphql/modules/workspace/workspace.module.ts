import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { WorkspaceGraphQLResolver } from '@interface/graphql/modules/workspace/workspace.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule],
  providers: [WorkspaceGraphQLResolver],
})
export class WorkspaceGraphQLModule {}
