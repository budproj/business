export interface AWSConfigInterface {
  region: string
  credentials: AWSCredentialsConfigInterface
  s3: AWSS3ConfigInterface
}

export interface AWSCredentialsConfigInterface {
  accessKeyID: string
  secretAccessKey: string
}

export interface AWSS3ConfigInterface {
  bucketName: string
}
