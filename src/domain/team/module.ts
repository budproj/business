import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultModule from 'domain/key-result'

import DomainTeamRepository from './repository'
import DomainTeamService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainTeamRepository]), DomainKeyResultModule],
  providers: [DomainTeamService],
  exports: [DomainTeamService],
})
class DomainTeamModule {}

export default DomainTeamModule
