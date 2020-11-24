import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import UserModule from 'domain/user'

import KeyResultRepository from './repository'
import KeyResultService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([KeyResultRepository]), UserModule],
  providers: [KeyResultService],
  exports: [KeyResultService],
})
class KeyResultModule {}

export default KeyResultModule
