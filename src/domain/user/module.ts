import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainUserRepository from './repository'
import DomainUserService from './service'
import DomainUserViewModule from './view'

@Module({
  imports: [TypeOrmModule.forFeature([DomainUserRepository]), DomainUserViewModule],
  providers: [DomainUserService],
  exports: [DomainUserService],
})
class UserModule {}

export default UserModule
