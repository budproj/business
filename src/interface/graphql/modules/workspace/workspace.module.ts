import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

@Module({
  imports: [CoreModule, GraphQLConfigModule],
  providers: [],
})
export class WorkspaceGraphQLModule {}
