import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainTeamRepository from './repository'
import DomainTeamService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainTeamRepository])],
  providers: [DomainTeamService],
  exports: [DomainTeamService],
})
class DomainTeamModule {}

export default DomainTeamModule
