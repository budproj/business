import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'

import AuthzModule from './authz'
import KeyResultViewModule from './key-result-views'
import KeyResultsModule from './key-results'

@Module({
  imports: [ConfigModule.forFeature(appConfig), KeyResultsModule, AuthzModule, KeyResultViewModule],
})
class AppModule {}

export default AppModule
