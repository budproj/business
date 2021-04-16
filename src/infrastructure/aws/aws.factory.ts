import { AwsServiceConfigurationOptionsFactory } from 'nest-aws-sdk'

import { AWSConfigProvider } from '@config/aws/aws.provider'

export function awsFactory(config: AWSConfigProvider): AwsServiceConfigurationOptionsFactory {
  return {
    region: config.region,
    credentials: {
      accessKeyId: config.credentials.accessKeyID,
      secretAccessKey: config.credentials.secretAccessKey,
    },
  }
}
