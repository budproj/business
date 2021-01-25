import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultModule from 'src/domain/key-result'
import databaseConfig from 'src/config/database/config'
import DomainTeamModule from 'src/domain/team'

import DomainObjectiveRepository from './repository'
import DomainObjectiveService from './service'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([DomainObjectiveRepository]),
    DomainKeyResultModule,
    DomainTeamModule,
  ],
  providers: [DomainObjectiveService],
  exports: [DomainObjectiveService],
})
class DomainObjectiveModule {}

export default DomainObjectiveModule
