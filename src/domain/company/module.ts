import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultModule from 'domain/key-result'
import DomainTeamModule from 'domain/team'

import DomainCompanyRepository from './repository'
import DomainCompanyService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainCompanyRepository]),
    DomainKeyResultModule,
    DomainTeamModule,
  ],
  providers: [DomainCompanyService],
  exports: [DomainCompanyService],
})
class DomainCompanyModule {}

export default DomainCompanyModule
