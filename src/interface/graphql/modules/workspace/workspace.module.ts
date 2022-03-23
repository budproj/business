import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { WorkspaceAccessControl } from '@interface/graphql/modules/workspace/workspace.access-control'
import { WorkspaceGraphQLResolver } from '@interface/graphql/modules/workspace/workspace.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule],
  providers: [WorkspaceGraphQLResolver, WorkspaceAccessControl],
})
export class WorkspaceGraphQLModule {}
