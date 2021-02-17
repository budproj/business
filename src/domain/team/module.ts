import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'
import DomainKeyResultModule from 'src/domain/key-result'

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
    forwardRef(() => DomainKeyResultModule),
  ],
  providers: [DomainTeamSpecification, DomainTeamService, DomainTeamRankingService],
  exports: [DomainTeamService],
})
class DomainTeamModule {}

export default DomainTeamModule
