import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'

import DomainUserRepository from './repository'
import DomainUserService from './service'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([DomainUserRepository]),
  ],
  providers: [DomainUserService],
  exports: [DomainUserService],
})
class UserModule {}

export default UserModule
