import { ConfigModule, ConfigService } from '@nestjs/config'
import { GqlModuleAsyncOptions } from '@nestjs/graphql'

import { gqlConfig } from 'config'

const graphQLFactory: GqlModuleAsyncOptions = {
  imports: [ConfigModule.forFeature(gqlConfig)],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    debug: configService.get('debug'),
    playground: configService.get('playground'),
    autoSchemaFile: configService.get('schemaFile'),
    cors: configService.get('cors'),
    useGlobalPrefix: true,
  }),
}

export default graphQLFactory
