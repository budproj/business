import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainCompanyRepository from './repository'
import DomainCompanyService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainCompanyRepository])],
  providers: [DomainCompanyService],
  exports: [DomainCompanyService],
})
class DomainCompanyModule {}

export default DomainCompanyModule
