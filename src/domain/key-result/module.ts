import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import UserModule from 'domain/user'

import KeyResultReportModule from './report'
import KeyResultRepository from './repository'
import KeyResultService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([KeyResultRepository]), UserModule, KeyResultReportModule],
  providers: [KeyResultService],
  exports: [KeyResultService],
})
class KeyResultModule {}

export default KeyResultModule
