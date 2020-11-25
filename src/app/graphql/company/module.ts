import { Module } from '@nestjs/common'

import DomainModule from 'domain/module'

import CompanyResolver from './resolver'

@Module({
  imports: [DomainModule],
  providers: [CompanyResolver],
})
class CompanysModule {}

export default CompanysModule
