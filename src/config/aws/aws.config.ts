import { registerAs } from '@nestjs/config'

import { AWSConfigInterface } from './aws.interface'

export const awsConfig = registerAs(
  'aws',
  (): AWSConfigInterface => ({
    region: process.env.AWS_REGION,

    credentials: {
      accessKeyID: process.env.AWS_CREDENTIALS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_ACCESS_KEY,
    },

    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
    },
  }),
)
