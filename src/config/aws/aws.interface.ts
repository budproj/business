export interface AWSConfigInterface {
  region: string
  credentials: AWSCredentialsConfigInterface
  s3: AWSS3ConfigInterface
  ses: AWSSESConfigInterface
  sqs: AWSSQSConfigInterface
  sns: AWSSNSConfigInterface
}

export interface AWSCredentialsConfigInterface {
  accessKeyID: string
  secretAccessKey: string
}

export interface AWSS3ConfigInterface {
  bucketName: string
}

export interface AWSSESConfigInterface {
  debug: boolean
  source: AWSSESSourceConfigInterface
}

export interface AWSSESSourceConfigInterface {
  name: string
  email: string
}

export interface AWSSQSConfigInterface {
  queueName: string
}

export interface AWSSNSConfigInterface {
  topic: string
}
