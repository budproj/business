import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'

import KeyResultsController from './controller'
import KeyResultsService from './service'

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  controllers: [KeyResultsController],
  providers: [KeyResultsService],
})
class KeyResultsModule {}

export default KeyResultsModule
