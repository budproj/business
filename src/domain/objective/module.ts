import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultModule from 'domain/key-result'
import DomainTeamModule from 'domain/team'

import DomainObjectiveRepository from './repository'
import DomainObjectiveService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainObjectiveRepository]),
    DomainKeyResultModule,
    DomainTeamModule,
  ],
  providers: [DomainObjectiveService],
  exports: [DomainObjectiveService],
})
class DomainObjectiveModule {}

export default DomainObjectiveModule
