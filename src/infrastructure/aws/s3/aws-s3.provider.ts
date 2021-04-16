import { Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { InjectAwsService } from 'nest-aws-sdk'

import { RepositoryStorageInterface } from '@adapters/storage/interfaces/repository.interface'
import { AWSS3ConfigInterface } from '@config/aws/aws.interface'
import { AWSConfigProvider } from '@config/aws/aws.provider'

import { FileAWSS3Interface } from './interfaces/file.interface'
import { RemoteFileAWSS3Interface } from './interfaces/remote-file.interface'

@Injectable()
export class AWSS3Provider implements RepositoryStorageInterface {
  private readonly config: AWSS3ConfigInterface

  constructor(
    @InjectAwsService(S3)
    private readonly remote: S3,
    awsConfig: AWSConfigProvider,
  ) {
    this.config = awsConfig.s3
  }

  public async upload(file: FileAWSS3Interface): Promise<RemoteFileAWSS3Interface> {
    const key = this.generateFileKey(file)
    const uploaded = await this.remote
      .putObject({
        Bucket: this.config.bucketName,
        Key: key,
        ContentType: file.type,
        Body: file.content,
      })
      .promise()

    console.log('ok')
    console.log(uploaded)

    return {} as any
  }

  private generateFileKey(file: FileAWSS3Interface): string {
    const timestamp = Date.now()
    const key = `${file.name}-${timestamp}.${file.extension}`

    return key
  }
}
