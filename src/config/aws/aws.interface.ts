export interface AWSConfigInterface {
  region: string
  credentials: AWSCredentialsConfigInterface
  s3: AWSS3ConfigInterface
  ses: AWSSESConfigInterface
}

export interface AWSCredentialsConfigInterface {
  accessKeyID: string
  secretAccessKey: string
}

export interface AWSS3ConfigInterface {
  bucketName: string
}

export interface AWSSESConfigInterface {
  source: AWSSESSourceConfigInterface
}

export interface AWSSESSourceConfigInterface {
  name: string
  email: string
}
