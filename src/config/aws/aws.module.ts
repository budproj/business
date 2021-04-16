import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AWSEnvironmentSchema } from './aws-environment.schema'
import { awsConfig } from './aws.config'
import { AWSConfigProvider } from './aws.provider'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
      validationSchema: AWSEnvironmentSchema,
    }),
  ],
  providers: [ConfigService, AWSConfigProvider],
  exports: [ConfigService, AWSConfigProvider],
})
export class AWSConfigModule {}
