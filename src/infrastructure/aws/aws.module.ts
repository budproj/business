import { Module } from '@nestjs/common'
import { AwsSdkModule } from 'nest-aws-sdk'

import { AWSConfigModule } from '@config/aws/aws.module'
import { AWSConfigProvider } from '@config/aws/aws.provider'

import { awsFactory } from './aws.factory'
import { AWSS3Provider } from './s3/aws-s3.provider'

@Module({
  imports: [
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: awsFactory,
        imports: [AWSConfigModule],
        inject: [AWSConfigProvider],
      },
    }),
  ],
  providers: [AWSS3Provider],
  exports: [AWSS3Provider],
})
export class AWSModule {}
