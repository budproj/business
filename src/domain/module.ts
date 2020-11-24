import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'config/database/config'

import KeyResultModule from './key-result'
import UserModule from './user'

@Module({
  imports: [KeyResultModule, UserModule, TypeOrmModule.forRoot(databaseConfig)],
  exports: [KeyResultModule, UserModule],
})
class DomainModule {}

export default DomainModule
