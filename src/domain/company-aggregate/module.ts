import { Module } from '@nestjs/common'

import CompanyAggregateService from './service'

@Module({
  providers: [CompanyAggregateService],
  exports: [CompanyAggregateService],
})
class CompanyAggregateModule {}

export default CompanyAggregateModule
