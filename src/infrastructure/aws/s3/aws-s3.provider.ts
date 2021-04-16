import { Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { InjectAwsService } from 'nest-aws-sdk'

import { VisibilityStorageEnum } from '@adapters/storage/enums/visilibity.enum'
import { FilePolicyStorageInterface } from '@adapters/storage/interfaces/file-policy.interface'
import { RepositoryStorageInterface } from '@adapters/storage/interfaces/repository.interface'
import { AWSS3ConfigInterface } from '@config/aws/aws.interface'
import { AWSConfigProvider } from '@config/aws/aws.provider'

import { FileAWSS3Interface } from './interfaces/file.interface'
import { RemoteFileAWSS3Interface } from './interfaces/remote-file.interface'

@Injectable()
export class AWSS3Provider implements RepositoryStorageInterface {
  private readonly config: AWSS3ConfigInterface
  private readonly urlPrefix: string

  constructor(
    @InjectAwsService(S3)
    private readonly remote: S3,
    awsConfig: AWSConfigProvider,
  ) {
    this.config = awsConfig.s3
    this.urlPrefix = this.getURLPrefix(awsConfig.region)
  }

  public async upload(file: FileAWSS3Interface): Promise<RemoteFileAWSS3Interface> {
    const key = this.generateFileKey(file)
    const acl = this.marshalACL(file.policy)

    await this.remote
      .putObject({
        Bucket: this.config.bucketName,
        Key: key,
        ContentType: file.type,
        Body: file.content,
        ACL: acl,
      })
      .promise()

    const response = this.buildRemoteFileResponse(key)
    console.log(response)

    return response
  }

  private getURLPrefix(region: string): string {
    return `https://s3-${region}.amazonaws.com`
  }

  private generateFileKey(file: FileAWSS3Interface): string {
    const timestamp = Date.now()
    const key = `${file.name}-${timestamp}.${file.extension}`

    return key
  }

  private marshalACL(policy?: FilePolicyStorageInterface): PutObjectRequest['ACL'] {
    if (policy?.write === VisibilityStorageEnum.PUBLIC) return 'public-read-write'
    if (policy?.read === VisibilityStorageEnum.PUBLIC) return 'public-read'

    return 'private'
  }

  private buildRemoteFileResponse(key: string): RemoteFileAWSS3Interface {
    return {
      path: this.getObjectURL(key),
    }
  }

  private getObjectURL(fileKey: string): string {
    return `${this.urlPrefix}/${this.config.bucketName}/${fileKey}`
  }
}
