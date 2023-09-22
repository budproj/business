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
    sqs: {
      endpoint: process.env.AWS_SQS_ENDPOINT,
      createTaskQueueName: process.env.AWS_SQS_CREATE_TASK_QUEUE_NAME,
      createTaskQueueUrl: process.env.AWS_SQS_CREATE_TASK_QUEUE_URL,
    },
    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
    },

    ses: {
      debug: process.env.AWS_SES_DEBUG_ENABLED === 'true',
      source: {
        name: process.env.AWS_SES_SOURCE_NAME,
        email: process.env.AWS_SES_SOURCE_EMAIL,
      },
    },
  }),
)
