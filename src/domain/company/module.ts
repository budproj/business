import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import CompanyRepository from './repository'
import CompanyService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([CompanyRepository])],
  providers: [CompanyService],
  exports: [CompanyService],
})
class CompanyModule {}

export default CompanyModule
