import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainTeamModule from 'src/domain/team'

import DomainKeyResultReportModule from './report'
import DomainKeyResultRepository from './repository'
import DomainKeyResultService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainKeyResultRepository]),
    forwardRef(() => DomainKeyResultReportModule),
    forwardRef(() => DomainTeamModule),
  ],
  providers: [DomainKeyResultService],
  exports: [DomainKeyResultService],
})
class DomainKeyResultModule {}

export default DomainKeyResultModule
