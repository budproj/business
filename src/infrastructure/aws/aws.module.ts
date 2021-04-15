import { Module } from '@nestjs/common'

import { AWSS3Provider } from './s3/aws-s3.provider'

@Module({
  providers: [AWSS3Provider],
  exports: [AWSS3Provider],
})
export class AWSModule {}
