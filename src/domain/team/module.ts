import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainUserModule from 'domain/user'

import DomainTeamRepository from './repository'
import DomainTeamService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainTeamRepository]), DomainUserModule],
  providers: [DomainTeamService],
  exports: [DomainTeamService],
})
class DomainTeamModule {}

export default DomainTeamModule
