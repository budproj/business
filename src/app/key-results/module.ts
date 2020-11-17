import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import CompanyAggregate from 'domain/company-aggregate'
import ObjectiveAggregate from 'domain/objective-aggregate'

import KeyResultsController from './controller'
import KeyResultsService from './service'

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  controllers: [KeyResultsController],
  providers: [KeyResultsService, ObjectiveAggregate, CompanyAggregate],
})
class KeyResultsModule {}

export default KeyResultsModule
