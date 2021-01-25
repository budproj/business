import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// import DomainKeyResultModule from 'src/domain/key-result'
import databaseConfig from 'src/config/database/config'

import DomainTeamRepository from './repository'
import DomainTeamService from './service'
import DomainTeamSpecification from './specification'
import DomainTeamSpecificationsModule from './specifications/module'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([DomainTeamRepository]),
    // forwardRef(() => DomainKeyResultModule),
    DomainTeamSpecificationsModule,
  ],
  providers: [DomainTeamSpecification, DomainTeamService],
  exports: [DomainTeamService],
})
class DomainTeamModule {}

export default DomainTeamModule
