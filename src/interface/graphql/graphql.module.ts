import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'
import { CoreModule } from '@core/core.module'
import { WorkspaceGraphQLModule } from '@interface/graphql/modules/workspace/workspace.module'

import { PermissionsGraphQLResolver } from './adapters/authorization/resolvers/permissions.resolver'
import { UploadGraphQLScalar } from './adapters/upload/scalars/upload.scalar'
import { DataloaderModule } from './dataloader/dataloader.module'
import { DataloaderService } from './dataloader/dataloader.service'
import { CycleGraphQLModule } from './modules/cycle/cycle.module'
import { KeyResultGraphQLModule } from './modules/key-result/key-result.module'
import { ObjectiveGraphQLModule } from './modules/objective/objective.module'
import { TeamGraphQLModule } from './modules/team/team.module'
import { UserGraphQLModule } from './modules/user/user.module'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [GraphQLConfigModule, DataloaderModule],
      useFactory: (dataloaderService: DataloaderService, config: GraphQLConfigProvider) => {
        return {
          debug: config.debug.enabled,
          playground: config.playground.enabled,
          introspection: config.introspection.enabled,
          autoSchemaFile: config.schema.filePath,
          useGlobalPrefix: config.globalPrefixEnabled,
          cors: false,
          context: () => ({
            loaders: dataloaderService.getLoaders(),
          }),
        }
      },
      inject: [DataloaderService, GraphQLConfigProvider],
    }),
    CoreModule,
    GraphQLConfigModule,
    UserGraphQLModule,
    TeamGraphQLModule,
    CycleGraphQLModule,
    ObjectiveGraphQLModule,
    KeyResultGraphQLModule,
    WorkspaceGraphQLModule,
  ],
  providers: [UploadGraphQLScalar, PermissionsGraphQLResolver],
})
export class GraphQLModule {}
