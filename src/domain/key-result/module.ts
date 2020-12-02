import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainUserModule from 'domain/user'

import DomainKeyResultReportModule from './report'
import DomainKeyResultRepository from './repository'
import DomainKeyResultService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainKeyResultRepository]),
    DomainUserModule,
    DomainKeyResultReportModule,
  ],
  providers: [DomainKeyResultService],
  exports: [DomainKeyResultService],
})
class DomainKeyResultModule {}

export default DomainKeyResultModule
