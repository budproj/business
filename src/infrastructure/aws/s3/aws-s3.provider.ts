import { Injectable } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { InjectAwsService } from 'nest-aws-sdk'

import { FilePolicyStorageInterface } from '@adapters/storage/interfaces/file-policy.interface'
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
    const acl = this.marshalACL(file.policy)

    const uploaded = await this.remote
      .putObject({
        Bucket: this.config.bucketName,
        Key: key,
        ContentType: file.type,
        Body: file.content,
        ACL: acl,
      })
      .promise()

    console.log('ok')
    console.log(uploaded)
    // TODO: Falta:
    // - Arrumar o ACL pra ficar público
    // - Arrumar tb o key pra usar o diretório correto
    // - Pegar a URL e retornar ela pra salvar no banco

    return {} as any
  }

  private generateFileKey(file: FileAWSS3Interface): string {
    const timestamp = Date.now()
    const key = `${file.name}-${timestamp}.${file.extension}`

    return key
  }

  private marshalACL(policy: FilePolicyStorageInterface): PutObjectRequest['ACL'] {
    return 'public-read'
  }
}
