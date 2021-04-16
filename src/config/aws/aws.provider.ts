import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AWSCredentialsConfigInterface, AWSS3ConfigInterface } from './aws.interface'

@Injectable()
export class AWSConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get region(): string {
    return this.configService.get<string>('aws.region')
  }

  get credentials(): AWSCredentialsConfigInterface {
    return this.configService.get<AWSCredentialsConfigInterface>('aws.credentials')
  }

  get s3(): AWSS3ConfigInterface {
    return this.configService.get<AWSS3ConfigInterface>('aws.s3')
  }
}
