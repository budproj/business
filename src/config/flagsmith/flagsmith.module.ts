import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { flagsmithConfig } from './flagsmith.config'
import { FlagsmithConfigProvider } from './flagsmith.provider'
import { FlagsmithEnvironmentSchema } from './flagsmith.schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [flagsmithConfig],
      validationSchema: FlagsmithEnvironmentSchema,
    }),
  ],
  providers: [ConfigService, FlagsmithConfigProvider],
  exports: [ConfigService, FlagsmithConfigProvider],
})
export class FlagsmithConfigModule {}
