import { Injectable } from '@nestjs/common'

import { RepositoryStorageInterface } from '@adapters/storage/interfaces/repository.interface'

import { FileAWSS3Interface } from './interfaces/file.interface'
import { RemoteFileAWSS3Interface } from './interfaces/remote-file.interface'

@Injectable()
export class AWSS3Provider implements RepositoryStorageInterface {
  public async upload(file: FileAWSS3Interface): Promise<RemoteFileAWSS3Interface> {
    console.log(file)
    return {} as any
  }
}
