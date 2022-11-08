import { AwsServiceConfigurationOptionsFactory } from 'nest-aws-sdk'

import { AWSConfigProvider } from '@config/aws/aws.provider'

export function awsFactory(config: AWSConfigProvider): AwsServiceConfigurationOptionsFactory {
  console.log('AWS CREDENTIALS', config.credentials.accessKeyID, config.credentials.secretAccessKey)
  return {
    region: config.region,
    credentials: {
      accessKeyId: config.credentials.accessKeyID,
      secretAccessKey: config.credentials.secretAccessKey,
    },
  }
}
