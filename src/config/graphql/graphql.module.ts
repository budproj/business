import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { GraphQLEnvironmentSchema } from './graphql-environment.schema'
import { graphqlConfig } from './graphql.config'
import { GraphQLConfigProvider } from './graphql.provider'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [graphqlConfig],
      validationSchema: GraphQLEnvironmentSchema,
    }),
  ],
  providers: [ConfigService, GraphQLConfigProvider],
  exports: [ConfigService, GraphQLConfigProvider],
})
export class GraphQLConfigModule {}
