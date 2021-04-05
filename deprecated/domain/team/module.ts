import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'
import DomainObjectiveModule from 'src/domain/objective'

import DomainTeamRankingService from './ranking'
import DomainTeamRepository from './repository'
import DomainTeamService from './service'
import DomainTeamSpecification from './specification'
import DomainTeamSpecificationsModule from './specifications/module'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([DomainTeamRepository]),
    DomainTeamSpecificationsModule,
    forwardRef(() => DomainObjectiveModule),
  ],
  providers: [DomainTeamSpecification, DomainTeamService, DomainTeamRankingService],
  exports: [DomainTeamService],
})
class DomainTeamModule {}

export default DomainTeamModule
