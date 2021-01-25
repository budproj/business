import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainTeamModule from 'src/domain/team'
import databaseConfig from 'src/config/database/config'

import DomainKeyResultReportModule from './report'
import DomainKeyResultCustomListModule from './custom-list'
import DomainKeyResultRepository from './repository'
import DomainKeyResultService from './service'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([DomainKeyResultRepository]),
    forwardRef(() => DomainTeamModule),
    forwardRef(() => DomainKeyResultReportModule),
    forwardRef(() => DomainKeyResultCustomListModule),
  ],
  providers: [DomainKeyResultService],
  exports: [DomainKeyResultService],
})
class DomainKeyResultModule {}

export default DomainKeyResultModule
