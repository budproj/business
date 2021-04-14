import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { TypeORMEnvironmentSchema } from './typeorm-environment.schema'
import { typeormConfig } from './typeorm.config'
import { TypeORMConfigProvider } from './typeorm.provider'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [typeormConfig],
      validationSchema: TypeORMEnvironmentSchema,
    }),
  ],
  providers: [ConfigService, TypeORMConfigProvider],
  exports: [ConfigService, TypeORMConfigProvider],
})
export class TypeORMConfigModule {}
