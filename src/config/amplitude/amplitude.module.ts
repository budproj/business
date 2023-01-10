import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AmplitudeEnvironmentSchema } from './amplitude-environment.schema.ts'
import { amplitudeConfig } from './amplitude.config'
import { AmplitudeConfigProvider } from './amplitude.provider'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [amplitudeConfig],
      validationSchema: AmplitudeEnvironmentSchema,
    }),
  ],
  providers: [ConfigService, AmplitudeConfigProvider],
  exports: [ConfigService, AmplitudeConfigProvider],
})
export class AmplitudeConfigModule {}
