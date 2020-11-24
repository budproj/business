import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'config/database/config'

import KeyResultModule from './key-result'
import ObjectiveModule from './objective'
import UserModule from './user'

@Module({
  imports: [KeyResultModule, UserModule, ObjectiveModule, TypeOrmModule.forRoot(databaseConfig)],
  exports: [KeyResultModule, UserModule, ObjectiveModule],
})
class DomainModule {}

export default DomainModule
