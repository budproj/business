import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import {
  AWSCredentialsConfigInterface,
  AWSS3ConfigInterface,
  AWSSESConfigInterface,
  AWSSNSConfigInterface,
  AWSSQSConfigInterface,
} from './aws.interface'

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

  get ses(): AWSSESConfigInterface {
    return this.configService.get<AWSSESConfigInterface>('aws.ses')
  }

  get sqs(): AWSSQSConfigInterface {
    return this.configService.get<AWSSQSConfigInterface>('aws.sqs')
  }

  get sns(): AWSSNSConfigInterface {
    return this.configService.get<AWSSNSConfigInterface>('aws.sns')
  }
}
