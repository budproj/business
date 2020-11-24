import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'config/database/config'

import KeyResultModule from './key-result'
import ObjectiveModule from './objective'
import TeamModule from './team'
import UserModule from './user'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    KeyResultModule,
    UserModule,
    ObjectiveModule,
    TeamModule,
  ],
  exports: [KeyResultModule, UserModule, ObjectiveModule, TeamModule],
})
class DomainModule {}

export default DomainModule
