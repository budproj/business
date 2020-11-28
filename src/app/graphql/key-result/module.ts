import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import DomainModule from 'domain/module'

import KeyResultResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [KeyResultResolver],
})
class KeyResultsModule {}

export default KeyResultsModule
