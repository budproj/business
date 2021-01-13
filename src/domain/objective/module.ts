import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultModule from 'src/domain/key-result'
import DomainTeamModule from 'src/domain/team'

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
