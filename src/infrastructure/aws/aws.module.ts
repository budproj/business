import { Module } from '@nestjs/common'
import { S3, SES, SNS, SQS } from 'aws-sdk'
import { AwsSdkModule } from 'nest-aws-sdk'

import { AWSConfigModule } from '@config/aws/aws.module'
import { AWSConfigProvider } from '@config/aws/aws.provider'
import { AWSSESProvider } from '@infrastructure/aws/ses/ses.provider'

import { awsFactory } from './aws.factory'
import { AWSS3Provider } from './s3/s3.provider'
import { AWSSNSProvider } from './sns/sns.provider'
import { AWSSQSProvider } from './sqs/sqs.provider'

@Module({
  imports: [
    AwsSdkModule.forRootAsync({
      services: [S3, SES, SQS, SNS],
      defaultServiceOptions: {
        useFactory: awsFactory,
        imports: [AWSConfigModule],
        inject: [AWSConfigProvider],
      },
    }),
    AWSConfigModule,
  ],
  providers: [AWSS3Provider, AWSSESProvider, AWSSQSProvider, AWSSNSProvider],
  exports: [AWSS3Provider, AWSSESProvider, AWSSQSProvider, AWSSNSProvider],
})
export class AWSModule {}
