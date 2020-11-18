import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'config/database/config'

import CompanyAggregateModule from './company-aggregate'
import ObjectiveAggregateModule from './objective-aggregate'

@Module({
  imports: [
    ObjectiveAggregateModule,
    CompanyAggregateModule,
    TypeOrmModule.forRoot(databaseConfig),
  ],
  exports: [ObjectiveAggregateModule, CompanyAggregateModule],
})
class DomainModule {}

export default DomainModule
