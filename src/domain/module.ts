import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'config/database/config'

import CompanyAggregateModule from './company-aggregate'
import ObjectiveAggregateModule from './objective-aggregate'
import UserAggregateModule from './user-aggregate'

@Module({
  imports: [
    ObjectiveAggregateModule,
    CompanyAggregateModule,
    UserAggregateModule,
    TypeOrmModule.forRoot(databaseConfig),
  ],
  exports: [ObjectiveAggregateModule, CompanyAggregateModule, UserAggregateModule],
})
class DomainModule {}

export default DomainModule
