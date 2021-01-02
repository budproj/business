import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainTeamModule from 'domain/team'

import DomainUserRepository from './repository'
import DomainUserService from './service'
import DomainUserViewModule from './view'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainUserRepository]),
    forwardRef(() => DomainUserViewModule),
    DomainTeamModule,
  ],
  providers: [DomainUserService],
  exports: [DomainUserService, DomainUserViewModule],
})
class UserModule {}

export default UserModule
