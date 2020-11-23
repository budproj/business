import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'

import AuthzModule from './authz'
import KeyResultViewModule from './key-result-views'
import KeyResultsModule from './key-results'
import ProgressReportsModule from './progress-reports'

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    AuthzModule,
    KeyResultsModule,
    KeyResultViewModule,
    ProgressReportsModule,
  ],
})
class AppModule {}

export default AppModule
