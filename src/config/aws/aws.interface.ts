export interface AWSConfigInterface {
  region: string

  credentials: AWSCredentialsConfigInterface
}

export interface AWSCredentialsConfigInterface {
  accessKeyID: string
  secretAccessKey: string
}
