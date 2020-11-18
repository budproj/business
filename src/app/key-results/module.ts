import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import DomainModule from 'domain/module'

import KeyResultsController from './controller'
import KeyResultsService from './service'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  controllers: [KeyResultsController],
  providers: [KeyResultsService, Logger],
})
class KeyResultsModule {}

export default KeyResultsModule
